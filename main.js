const path = require('path')
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const Menu = electron.Menu
const Tray = electron.Tray

const ipcMain = electron.ipcMain
const dialog = require('electron').dialog

let canKill = false
ipcMain.on('kill', function (event, arg) {
  canKill = true
  app.quit()
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let appIcon

function createWindow () {
  // Create the browser window.
  const iconName = 'icon.png'
  const iconPath = path.join(__dirname, iconName)
  mainWindow = new BrowserWindow({width: 500, height: 600, icon:iconPath})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  let count = 0
  mainWindow.on('close', function (event) {
    if (!canKill) {
      event.preventDefault()
      const options = {
        type: 'info',
        title: 'Exit?',
        message: "Are you suer to EXIT?",
        buttons: ['Yes', 'No']
      }
      dialog.showMessageBox(options, function (index) {
        event.sender.send('information-dialog-selection', index)
      })
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  

  mainWindow.on('minimize',function(event){
    event.preventDefault()
    mainWindow.hide()
  });

    appIcon = new Tray(iconPath);
    var contextMenu = Menu.buildFromTemplate([

            { label: 'Show App', click:  function(){
                mainWindow.show();
            } },

            { label: 'Quit', click:  function(){
                app.isQuiting = true;
                app.quit();
            } }
        ]);
    appIcon.setToolTip('KcptunManager');
    appIcon.setContextMenu(contextMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})





// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
