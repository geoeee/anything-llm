import { app, BrowserWindow, Menu, MenuItem, dialog, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { fork, spawn } from "child_process";
import { loadConf, saveConf } from "./conf.js";

import * as Logger from "./log-helper.js";
Logger.initLogger();

let __dirname = path.dirname(fileURLToPath(import.meta.url));
const __nativeDirname = __dirname;
console.log("dir", __dirname);

if (__dirname.indexOf("app.asar") >= 0) {
  __dirname = path.join(__dirname, "..");
  console.log("change root path to", __dirname);
}

let mainWindow = null;
let loadingWindow = null;

const default_ollama_path = path.join(__dirname, "../ollama/models");
let mainConf = loadConf({
  OLLAMA_MODELS: default_ollama_path,
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      nodeIntegration: false, // 推荐安全方式
      contextIsolation: true, // 启用上下文隔离
      preload: __dirname + "/preload.js", // 预加载脚本
    },
  });

  // 加载Vite开发服务器或生产构建
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  initMenus();
}

function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    width: 800,
    height: 460,
    resizable: false,
    alwaysOnTop: true,
    modal: true,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
    },
    icon: path.join(__dirname, "icon.ico"),
  });

  aboutWindow.loadFile(path.join(app.getAppPath(), "electron", "about.html"));

  aboutWindow.on("closed", () => {
    aboutWindow.destroy();
  });
}

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    alwaysOnTop: true,
    modal: true,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
    },
    icon: path.join(__dirname, "icon.ico"),
  });

  loadingWindow.loadFile(
    path.join(app.getAppPath(), "electron", "loading.html")
  );

  loadingWindow.on("closed", () => {
    loadingWindow.destroy();
  });
}

function initMenus() {
  const defaultMenu = Menu.getApplicationMenu();
  if (defaultMenu) {
    const helpMenuItem = defaultMenu.items.find(
      (item) => item.label.toLowerCase() === "help"
    );

    if (helpMenuItem && helpMenuItem.submenu) {
      helpMenuItem.submenu.clear();

      helpMenuItem.submenu.append(
        new MenuItem({
          label: "About",
          click: () => {
            console.log("More button clicked");
            createAboutWindow();
          },
        })
      );

      Menu.setApplicationMenu(defaultMenu);
    }
  }
}

const childProcesses = new Map();

function trackProcess(key, process) {
  childProcesses.set(key, process);
  process.on("exit", () => {
    childProcesses.delete(key);
  });
}

function stopProcess(key) {
  const proc = childProcesses.get(key);
  if (proc && !proc.killed) {
    proc.kill("SIGTERM");
    childProcesses.delete(key);
    console.log(`Process ${key} stopped.`);
  }
}

function restartProcess(key, startFunction) {
  stopProcess(key);
  console.log(`Restarting process ${key}...`);
  startFunction();
}

function initOllamaProcess() {
  const ollamaProcess = spawn(
    path.join(__dirname, "../ollama/ollama.exe"),
    ["serve"],
    {
      env: {
        ...process.env,
        OLLAMA_HOST: "127.0.0.1:11434",
        OLLAMA_MODELS: mainConf.OLLAMA_MODELS || default_ollama_path,
      },
    }
  );
  console.log("[Ollama] Process started on host:", {
    OLLAMA_HOST: process.env.OLLAMA_HOST || "127.0.0.1:11434",
    OLLAMA_MODELS: process.env.OLLAMA_MODELS || default_ollama_path,
  });

  ollamaProcess.on("error", (err) => {
    console.error("Ollama process error:", err);
  });
  trackProcess("ollama", ollamaProcess);
}

function initCollectorProcess() {
  const collectorProcess = fork(path.join(__dirname, "../collector/index.js"), {
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
  });
  collectorProcess.on("error", (err) => {
    console.error("Collector process error:", err);
  });
  console.log(
    "Server process started",
    "STORAGE DIR: ",
    path.join(__dirname, "../storage")
  );
  trackProcess("collector", collectorProcess);
}

function initServerProcesses() {
  console.log("[server path]", path.join(__dirname, "../server/index.js"));
  const serverProcess = fork(path.join(__dirname, "../server/index.js"), {
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
  });
  serverProcess.on("error", (err) => {
    console.error("Server process error:", err);
  });
  console.log("Server process started", "NODE ENV: ", process.env.NODE_ENV);
  console.log(
    "Server process started",
    "STORAGE DIR ENV: ",
    process.env.STORAGE_DIR
  );
  trackProcess("server", serverProcess);

  console.log(
    "[collector path]",
    path.join(__dirname, "../collector/index.js")
  );
}

function initFrontServer() {
  console.log(
    "[frontend path]",
    path.join(__nativeDirname, "frontend-server.js")
  );
  const frontendServerProcess = fork(
    path.join(__nativeDirname, "frontend-server.js"),
    {
      env: {
        ...process.env,
        NODE_ENV: "production",
      },
    }
  );
  trackProcess("frontend", frontendServerProcess);
}

function checkServiceIsReady(whenReady, interval = 1000) {
  const checkServer = fetch("http://127.0.0.1:3001/health");
  const checkCollector = fetch("http://127.0.0.1:8888");
  const checkOllama = fetch("http://127.0.0.1:11434");
  Promise.all([checkServer, checkCollector, checkOllama])
    .then(() => {
      console.log("All services are ready");
      if (whenReady) {
        whenReady();
      }
    })
    .catch(() => {
      console.error("Server not started");
      setTimeout(() => {
        checkServiceIsReady(whenReady, interval);
      }, interval);
    });
}

function checkAndCreateWindow() {
  if (loadingWindow === null) {
    createLoadingWindow();
  }
  if (mainWindow !== null) {
    return;
  }
  checkServiceIsReady(() => {
    if (loadingWindow) {
      loadingWindow.close();
    }
    loadingWindow = null;
    createWindow();
  }, 1000);
}

initOllamaProcess();
initServerProcesses();
initCollectorProcess();
initFrontServer();

app.whenReady().then(checkAndCreateWindow);

ipcMain.handle("select-folder", async (modelType) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "选择文件夹",
    properties: ["openDirectory"],
  });
  const newPath = result.filePaths[0] || null;
  if (!newPath) {
    return mainConf["OLLAMA_MODELS"];
  }
  mainConf = {
    ...mainConf,
    OLLAMA_MODELS: newPath,
  };
  createLoadingWindow();
  saveConf(mainConf);

  stopProcess("ollama");
  stopProcess("server");
  stopProcess("collector");
  await new Promise((resolve) => {
    setTimeout(() => {
      initOllamaProcess();
      initServerProcesses();
      initCollectorProcess();
      resolve();
    }, 1000);
  });
  await new Promise((resolve) => {
    checkServiceIsReady(resolve, 1000);
  });
  if (loadingWindow) {
    loadingWindow.close();
  }
  loadingWindow = null;
  return newPath;
});

ipcMain.handle("get-conf", async () => {
  return mainConf;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  childProcesses.forEach((proc, key) => stopProcess(key));
});

process.on("exit", () => {
  childProcesses.forEach((proc, key) => stopProcess(key));
});

app.on("activate", () => {
  checkAndCreateWindow();
});
