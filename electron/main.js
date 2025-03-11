import { app, BrowserWindow } from "electron";
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

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800
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
}

const childProcesses = [];

function trackProcess(process) {
  childProcesses.push(process);
  process.on("exit", () => {
    const index = childProcesses.indexOf(process);
    if (index > -1) childProcesses.splice(index, 1);
  });
}

console.log("[server path]", path.join(__dirname, "../server/index.js"));
const serverProcess = fork(path.join(__dirname, "../server/index.js"), {
  env: {
    ...process.env,
    NODE_ENV: "production",
  },
});

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
trackProcess(serverProcess);

console.log("Server process started", "NODE ENV: ", process.env.NODE_ENV);
console.log(
  "Server process started",
  "STORAGE DIR ENV: ",
  process.env.STORAGE_DIR
);
console.log(
  "Server process started",
  "STORAGE DIR: ",
  path.join(__dirname, "../storage")
);
serverProcess.on("error", (err) => {
  console.error("Server process error:", err);
});

console.log("[collector path]", path.join(__dirname, "../collector/index.js"));
const collectorProcess = fork(path.join(__dirname, "../collector/index.js"), {
  env: {
    ...process.env,
    NODE_ENV: "production",
  },
});
trackProcess(collectorProcess);

collectorProcess.on("error", (err) => {
  console.error("Collector process error:", err);
});

const ollamaProcess = spawn(
  path.join(__dirname, "../ollama/ollama.exe"),
  ["serve"],
  {
    env: {
      ...process.env,
      OLLAMA_HOST: "0.0.0.0:11435"
    }
  }
);
trackProcess(ollamaProcess);

ollamaProcess.on("error", (err) => {
  console.error("Ollama process error:", err);
});

app.whenReady().then(createWindow);

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
  if (mainWindow === null) createWindow();
});
