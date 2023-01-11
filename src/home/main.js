const {
    app,
    BrowserWindow
} = require('electron')

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 1000,
        height: 600,
        // frame: false, // remove the titlebar
        // titleBarStyle: 'hidden', // hide the titlebar in macOS
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('index.html')
}
app.on('ready', createWindow)