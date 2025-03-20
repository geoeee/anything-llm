const path = require("path");
const os = require("os");
const log4js = require("log4js");
const fs = require("fs");

const loggerServer = log4js.getLogger("server");

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
    server: {
      type: "file",
      maxLogSize: 1024 * 1024 * 30,
      backups: 30,
      filename: path.resolve(
        os.homedir(),
        ".anythingllm",
        "logs",
        "server.log"
      ),
      category: "normal",
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: { appenders: ["stdout", "server"], level: "debug" },
    server: { appenders: ["stdout", "server"], level: "debug" },
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
    const target = loggerServer[loggerType].bind(loggerServer);
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
    }
  });
};

function initLogger(config) {
  initConfigure(config);
  consoleToLogger();

  process.on("uncaughtException", (...args) => {
    console.error(args);
  });
}

function stopLogger(cb) {
  log4js.shutdown(cb);
}

module.exports = {
  initLogger,
  stopLogger,
};
