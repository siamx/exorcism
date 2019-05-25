import { app, Menu, Tray, BrowserWindow, nativeImage } from 'electron'
const path = require('path')

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

function notifyRenderer(action) {
  mainWindow.webContents.send('action', action)
}

let mainWindow
let tray

function createTrayIcon () {
  let trayIcon = nativeImage.createFromPath(path.join(__statics, 'icons/favicon-16x16.png'))
  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'New', click () { notifyRenderer('new') }},
    { label: 'Next', click () { notifyRenderer('next') }},
    { label: 'Previous', click () { notifyRenderer('previous') }},
    { label: 'Delete', click () { notifyRenderer('delete') }},
    { label: 'Show', click () { if (mainWindow) { mainWindow.show() }}},
    { label: 'Quit', role: 'quit' }
  ])
  tray.setToolTip('Exorcism')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    }
  })
}

function createWindow () {
  let windowIcon = nativeImage.createFromPath(path.join(__statics, 'icons/icon-128x128.png'))
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      webSecurity: false
    },
    icon: windowIcon
  })
  mainWindow.loadURL(process.env.APP_URL)
  mainWindow.on('closed', () => { mainWindow = null })
  mainWindow.on('minimize', () => { mainWindow.hide() })
}

app.on('ready', createWindow)
app.on('ready', createTrayIcon)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
