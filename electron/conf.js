import os from "os";
import fs from "fs";
import path from "path";

const confPath = path.resolve(os.homedir(), ".anythingllm", "conf");
const confFile = path.resolve(confPath, "main.json");

if (!fs.existsSync(confPath)) {
  fs.mkdirSync(confPath, { recursive: true });
}

export const loadConf = (defConf = {}) => {
  for (const key in defConf) {
    process.env[key] = defConf[key];
  }
  if (fs.existsSync(confFile)) {
    const conf = fs.readFileSync(confFile, "utf-8");
    const envs = JSON.parse(conf);
    for (const key in envs) {
      process.env[key] = envs[key];
    }
    return envs;
  } else {
    return defConf;
  }
};

export const saveConf = (envs = {}) => {
  for (const key in envs) {
    process.env[key] = envs[key];
  }
  const savedConf = loadConf();
  const newConf = { ...savedConf, ...envs };
  fs.writeFileSync(confFile, JSON.stringify(newConf, null, 4));
  return newConf;
};
