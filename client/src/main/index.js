import { app, shell, BrowserWindow, ipcMain, session } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false, // Allow running untrusted content
      webSecurity: false, // Disable web security (CSP enforcement)
      allowRunningInsecureContent: true, // Allow mixed content (HTTP/HTTPS)
      contextIsolation: false, // Disable for better access to DOM
      nodeIntegration: true, // Allow renderer to use Node.js APIs
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer based on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for Windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  // Modify Content Security Policy (CSP)
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: blob: filesystem:;",
          "script-src * 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;",
          "style-src * 'self' 'unsafe-inline' https://fonts.googleapis.com;",
          "font-src * 'self' data: https://fonts.gstatic.com;",
          "img-src * 'self' data: blob:;",
          "media-src * 'self' data: blob:;",
          "connect-src * 'self' data: blob:;",
          "frame-src *;",
        ].join(' '),
      },
    });
  });

  createWindow();

  app.on('activate', function () {
    // On macOS, recreate a window in the app when the dock icon is clicked
    // and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
