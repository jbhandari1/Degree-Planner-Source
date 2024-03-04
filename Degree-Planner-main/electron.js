const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

// Logging
const util = require('util')
const logFile = fs.createWriteStream('electron.log', { flags: 'a' })
// Or 'w' to truncate the file every time the process starts.
const logStdout = process.stdout

console.log = function () {
    logFile.write(util.format.apply(null, arguments) + '\n')
    logStdout.write(util.format.apply(null, arguments) + '\n')
}
console.error = console.log
// End logging

// Handle install here
if (!handleSquirrelEvent()) {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(createWindow)

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
}

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false
    }

    const ChildProcess = require('child_process')
    const path = require('path')

    const appFolder = path.resolve(process.execPath, '..')
    const rootAtomFolder = path.resolve(appFolder, '..')
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'))

    const spawn = function (command, args) {
        let spawnedProcess

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true,
            })
        } catch (error) {}

        return spawnedProcess
    }

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args)
    }

    const squirrelEvent = process.argv[1]
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', process.execPath])

            setTimeout(app.quit, 5000)
            return true

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', process.execPath])

            setTimeout(app.quit, 5000)
            return true

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit()
            return true
        default:
            return false
    }
}

function createWindow() {
    ipcMain.handle('degreeRequirements', loadRequirements)
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1500,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(
        app.isPackaged
            ? `file://${path.join(__dirname, 'build/index.html')}`
            : 'http://localhost:3000'
    )
    // Open the DevTools.
    if (!app.isPackaged) {
        win.webContents.openDevTools({ mode: 'detach' })
    }
}

function loadRequirements(event) {
    const requirementsFolder = path.join(__dirname, 'track_requirements')
    const files = fs
        .readdirSync(requirementsFolder)
        .filter((f) => f.endsWith('.json') && !f.startsWith('package'))
        .map((f) =>
            JSON.parse(fs.readFileSync(path.join(requirementsFolder, f)))
        )
    return files
}
