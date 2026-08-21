const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let filePathToOpen = null;

// macOS file open handler
app.on('open-file', (event, path) => {
  event.preventDefault();
  filePathToOpen = path;
  if (mainWindow) {
    sendFileToRenderer(path);
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // Windows/Linux file open check (via argv)
  mainWindow.webContents.on('did-finish-load', () => {
    if (process.platform !== 'darwin') {
      const openArg = process.argv.find(arg => arg.endsWith('.lightning'));
      if (openArg) {
        sendFileToRenderer(openArg);
      }
    } else if (filePathToOpen) {
      sendFileToRenderer(filePathToOpen);
    }
  });
}

function sendFileToRenderer(filePath) {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (!err) {
      mainWindow.webContents.send('open-lightning-file', {
        path: filePath,
        content: JSON.parse(data)
      });
    }
  });
}

app.whenReady().then(createWindow);
