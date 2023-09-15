import path from 'path';
import load from './load';
import hashText from './hashText';
import { BrowserWindow, dialog } from 'electron'

export default function passEnter(win, app, langAM) {
    const { x, y } = win.getBounds();
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
            /*       nodeIntegration: true,
                  contextIsolation: false,
                  worldSafeExecuteJavaScript: true, */
            preload: path.join(app.getAppPath(), 'preload', 'index.js')
        }
    })
    winCode.loadFile('renderer/windowPassEnter.html');
    // winCode.webContents.openDevTools({ mode: 'detach' })
    // получаем объект webContents для окна
    // const contents = winCode.webContents;
    // console.log('winCode.getId(): ', winCode.id);

    winCode.on('close', () => {
        winCode = null;
        win = null;
        app.quit();
      })

    // Выход при нажатии cancel в окне ввода пароля
    winCode.webContents.ipc.on('exit', () => {
        winCode.destroy();
        app.quit();
    })

    return new Promise(resolve => {
        winCode.webContents.ipc.on('passClick', (_, password) => {
            const loadPass = load('pas') ?? 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e';
            if (loadPass.length !== 128) throw new Error('### Password structure error!');
            if (loadPass === hashText(password)) {
                winCode.destroy();
                return resolve(password);
            } else {
                dialog.showMessageBoxSync(winCode, {
                    type: 'info',
                    title: langAM.titlePas,
                    message: langAM.messagePas,
                    buttons: langAM.buttonsPas
                });
            }
        })

    }, reject => {
        console.eroor('reject');
        return reject();
    })

}