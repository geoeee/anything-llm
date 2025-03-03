const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;
let collectorProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 启动服务器进程
  serverProcess = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, '../server'),
    env: { ...process.env, NODE_ENV: 'production' }
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  // 启动收集器进程
  collectorProcess = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, '../collector'),
    env: { ...process.env, NODE_ENV: 'production' }
  });

  collectorProcess.stdout.on('data', (data) => {
    console.log(`Collector: ${data}`);
  });

  // 等待服务器启动后加载前端页面
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3001');
  }, 3000);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  // 关闭子进程
  serverProcess && serverProcess.kill();
  collectorProcess && collectorProcess.kill();
});