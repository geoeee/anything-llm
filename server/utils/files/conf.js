const os = require("os");
const fs = require("fs");
const path = require("path");

const confPath = path.resolve(os.homedir(), ".anythingllm", "conf");
const confFile = path.resolve(confPath, "conf.json");

if (!fs.existsSync(confPath)) {
  fs.mkdirSync(confPath, { recursive: true });
}

const loadConf = (defConf = {}) => {
  if (fs.existsSync(confFile)) {
    const conf = fs.readFileSync(confFile);
    const envs = JSON.parse(conf);
    for (const key in envs) {
      process.env[key] = envs[key];
    }
    return envs;
  } else {
    for (const key in defConf) {
      process.env[key] = defConf[key];
    }
    return defConf;
  }
};

const saveConf = (envs = {}) => {
  for (const key in envs) {
    process.env[key] = envs[key];
  }
  const savedConf = loadConf();
  const newConf = { ...savedConf, ...envs };
  fs.writeFileSync(confFile, JSON.stringify(newConf, null, 4));
  return newConf;
};

module.exports = {
  loadConf,
  saveConf,
};
