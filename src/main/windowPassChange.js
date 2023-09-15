import path from 'path';
// import { win, savePassword } from './index'
import load from './load';
import hashText from './hashText';
import { app, BrowserWindow, dialog } from 'electron'
import langAM from './languageAM';


export default function passChange(win, savePassword, langAM) {
    const {x, y} = win.getBounds();
    let winCode = new BrowserWindow({
        title: 'Enter code',
        width: 218 + 16,
        height: 238 + 38,
        resizable: true,
        frame: true,
        x: x + 20,
        y: y + 100,
        // alwaysOnTop: true,
        autoHideMenuBar: true,
        parent: win,
        modal: true,
        webPreferences: {
            /*    nodeIntegration: true,
                  contextIsolation: false,
                  worldSafeExecuteJavaScript: true, */
            preload: path.join(app.getAppPath(), 'preload', 'index.js')
        }
    })
    
    winCode.loadFile('renderer/windowPassChange.html');

    // Выход при нажатии cancel в окне ввода пароля
    winCode.webContents.ipc.on('cancel',  () => {
        winCode.destroy();
    })

    winCode.webContents.ipc.on('passClick', (_, password) => {
        // [input,input,input,cheked]
        const loadPass = load('pas') ?? 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e';
        if (loadPass === hashText(password[0])) {
            if (password[4] === true) {
                savePassword(password[0])
                dialog.showMessageBoxSync({
                    type: 'none',
                    title: langAM.titleChangeSuccessfully,
                    message: langAM.messageChangeWithout,
                    buttons: ['OK']
                })
                winCode.destroy();
            } else if (password[1] === password[2]) {
                savePassword(password[1]);
                dialog.showMessageBoxSync(winCode, {
                    type: 'none',
                    title: langAM.titleChangeSuccessfully,
                    message: langAM.messageChangeWith,
                    buttons: ['OK']
                })
                winCode.destroy();
            } else {
                dialog.showMessageBoxSync(winCode, {
                    type: 'info',
                    title: langAM.titleChangeUnsuccessfully,
                    message: langAM.messageChangeUnsuccessfully,
                    buttons: ['OK']
                })
            }
        } else {
            dialog.showMessageBoxSync(winCode, {
                type: 'info',
                title: langAM.titleChangeWrong,
                message: langAM.messageChangeWrong,
                buttons: ['OK']
            })
        }
    })
}