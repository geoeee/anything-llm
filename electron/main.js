import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 加载Vite开发服务器或生产构建
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    console.log('Production build path:', path.join(__dirname, '../frontend/dist/index.html'));
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

const childProcesses = [];

function trackProcess(process) {
  childProcesses.push(process);
  process.on('exit', () => {
    const index = childProcesses.indexOf(process);
    if (index > -1) childProcesses.splice(index, 1);
  });
}

const serverProcess = fork(path.join(__dirname, '../server/index.js'), {
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});
trackProcess(serverProcess);

console.log('Server process started', "NODE ENV: ", process.env.NODE_ENV);
console.log('Server process started', "STORAGE DIR ENV: ", process.env.STORAGE_DIR);
console.log('Server process started', "STORAGE DIR: ", path.join(__dirname, '../storage'));
serverProcess.on('error', (err) => {
  console.error('Server process error:', err);
});

const collectorProcess = fork(path.join(__dirname, '../collector/index.js'), {
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});
trackProcess(collectorProcess);

collectorProcess.on('error', (err) => {
  console.error('Collector process error:', err);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  childProcesses.forEach(proc => {
    if (!proc.killed) {
      proc.kill('SIGTERM');
    }
  });
});

process.on('exit', () => {
  childProcesses.forEach(proc => {
    if (!proc.killed) {
      proc.kill('SIGKILL');
    }
  });
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});