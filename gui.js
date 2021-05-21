const { app, BrowserWindow } = require('electron');
const api = require('./api');

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = false;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'splitter'
    });

    win.loadFile('gui.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});