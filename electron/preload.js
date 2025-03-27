const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectModelFolder: (modelType) =>
    ipcRenderer.invoke("select-folder", modelType),
  getConf: () => ipcRenderer.invoke("get-conf"),
});
