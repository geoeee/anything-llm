import path from "path";
import os from "os";
import log4js from "log4js";
import fs from "fs";
import { ipcMain } from "electron";

const loggerMain = log4js.getLogger("main");
const loggerRender = log4js.getLogger("render");

if (!fs.existsSync(path.resolve(os.homedir(), ".anythingllm", "logs"))) {
  fs.mkdirSync(path.resolve(os.homedir(), ".anythingllm", "logs"), {
    recursive: true,
  });
}

const log4jsConf = {
  pm2: true,
  appenders: {
    stdout: {
      type: "console",
    },
    main: {
      type: "file",
      maxLogSize: 1024 * 1024 * 30,
      backups: 30,
      filename: path.resolve(os.homedir(), ".anythingllm", "logs", "main.log"),
      category: "normal",
      alwaysIncludePattern: true,
    },
    render: {
      type: "file",
      maxLogSize: 1024 * 1024 * 30,
      backups: 30,
      filename: path.resolve(
        os.homedir(),
        ".anythingllm",
        "logs",
        "render.log"
      ),
      category: "normal",
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: { appenders: ["stdout", "main"], level: "debug" },
    main: { appenders: ["stdout", "main"], level: "debug" },
    render: { appenders: ["render"], level: "debug" },
  },
};

const initConfigure = (config) => {
  log4js.configure(config || log4jsConf);
};

const consoleToLogger = () => {
  const types = {
    log: "info",
    info: "info",
    debug: "debug",
    warn: "warn",
    error: "error",
    trace: "trace",
  };

  Object.entries(types).forEach(([consoleType, loggerType]) => {
    const source = console[consoleType];
    const target = loggerMain[loggerType].bind(loggerMain);
    if (!!source && !!target) {
      console[consoleType] = (...messages) => {
        const _messages = (messages || []).map((message) => {
          if (typeof message === "object") {
            return JSON.stringify(message, null, 4);
          }
          return message + "";
        });
        target(..._messages);
      };

      ipcMain.on(`print-log-${consoleType}`, (event, ...args) => {
        loggerRender[loggerType](...args);
      });
    }
  });
};

export function initLogger(config) {
  initConfigure(config);
  consoleToLogger();

  process.on("uncaughtException", (...args) => {
    console.error(args);
  });
}

export function stopLogger(cb) {
  log4js.shutdown(cb);
}
