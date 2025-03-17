import { app, BrowserWindow, Menu, MenuItem } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { fork, spawn } from "child_process";

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

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "icon.ico"),
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

  aboutWindow.loadFile(path.join(__dirname, "about.html"));

  // 监听窗口关闭事件
  aboutWindow.on("closed", () => {
    aboutWindow.destroy();
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

const childProcesses = [];

function trackProcess(process) {
  childProcesses.push(process);
  process.on("exit", () => {
    const index = childProcesses.indexOf(process);
    if (index > -1) childProcesses.splice(index, 1);
  });
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
  trackProcess(serverProcess);

  console.log(
    "[collector path]",
    path.join(__dirname, "../collector/index.js")
  );
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
  trackProcess(collectorProcess);
  const ollamaProcess = spawn(
    path.join(__dirname, "../ollama/ollama.exe"),
    ["serve"],
    {
      env: {
        ...process.env,
        OLLAMA_HOST: "127.0.0.1:11434",
      },
    }
  );
  console.log(
    "[Ollama] Process started on host:",
    process.env.OLLAMA_HOST || "127.0.0.1:11434"
  );

  ollamaProcess.on("error", (err) => {
    console.error("Ollama process error:", err);
  });
  trackProcess(ollamaProcess);
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
  trackProcess(frontendServerProcess);
}

function checkAndCreateWindow() {
  if (mainWindow !== null) {
    return;
  }
  const checkServer = fetch("http://127.0.0.1/3001");
  const checkCollector = fetch("http://127.0.0.1/8888");
  const checkOllama = fetch("http://127.0.0.1/11434");
  Promise.all([checkServer, checkCollector, checkOllama])
    .then(() => {
      createWindow();
    })
    .catch(() => {
      console.error("Server not started");
      setTimeout(checkAndCreateWindow, 1000);
    });
}

initServerProcesses();
initFrontServer();

app.whenReady().then(checkAndCreateWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  childProcesses.forEach((proc) => {
    if (!proc.killed) {
      proc.kill("SIGTERM");
    }
  });
  if (frontendServerProcess && !frontendServerProcess.killed) {
    frontendServerProcess.kill("SIGTERM");
  }
});

process.on("exit", () => {
  childProcesses.forEach((proc) => {
    if (!proc.killed) {
      proc.kill("SIGKILL");
    }
  });
  if (frontendServerProcess && !frontendServerProcess.killed) {
    frontendServerProcess.kill("SIGKILL");
  }
});

app.on("activate", () => {
  checkAndCreateWindow();
});
