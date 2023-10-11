import path from 'path'
import { app, BrowserWindow, Menu, Tray, ipcMain, Notification } from 'electron'
import { trayMenu } from './trayMenu';
const fs = require('fs');
import passEnter from './windowPassEnter';
import passChange from './windowPassChange';
import icon from 'icon.png'
import save from './save';
import load from './load';
import hashText from './hashText';
import lang from './language';
import langAM from './languageAM'
// var isEmpty = require('lodash/isEmpty');
// import { reject } from 'lodash';

let win;

// Загрузка языка
let ln = load('language') ?? 'en';
if (!ln === 'en' || !ln === 'uk' || !ln === 'ru') {
  throw new Error('### Error: Language error when loading indentifier!');
}

// Константы расположения файлов
const PATH_template = path.join(process.cwd(), 'JsonStorage', 'template');
const PATH_data = path.join(process.cwd(), 'JsonStorage', 'data');


// Текущие данные, обновляются динамически
let currentPassword;
let currentData = null;
let currentTemplate = null;

const gotTheLock = app.requestSingleInstanceLock();

// Основное меню
const templateMenu = [
  {
    label: lang.tm.dataAccounting[ln],
    click: dataAccounting
  },
  {
    label: lang.tm.accountManagement[ln],
    click: accountManagement
  },
  {
    label: lang.tm.passChange[ln],
    click: () => passChange(win, savePassword, langAM[ln])
  },
  {
    label: lang.tm.language[ln],
    submenu: [
      {
        label: 'English',
        type: 'radio',
        checked: ln === 'en',
        click: language('en')
      },
      {
        label: 'Украинский',
        type: 'radio',
        checked: ln === 'uk',
        click: language('uk')
      },
      {
        label: 'Русский',
        type: 'radio',
        checked: ln === 'ru',
        click: language('ru')
      }
    ]

  },
  {
    label: lang.tm.quitProgram[ln],
    click: quitProgram
  },
  {
    label: lang.tm.help[ln],
    click: help
  },
]

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    title: CONFIG.name,
    width: CONFIG.width,
    height: CONFIG.height,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: false,
      // worldSafeExecuteJavaScript: true,
      preload: path.join(app.getAppPath(), 'preload', 'index.js')
    }
  })
  win.loadFile('renderer/index.html');
  win.webContents.openDevTools({ mode: 'detach' })
  // win.webContents.openDevTools();

  // Отсылаем сообщение о загрузке (старт процесса)
  win.webContents.on('did-finish-load', () => {
    // Введение пароля
    passEnter(win, app, langAM[ln]).then(password => {
      currentPassword = password;
      currentTemplate = load('template', currentPassword) ?? [];
      currentData = load('data', currentPassword) ?? {};
      win.webContents.send('loaded', {
        appName: CONFIG.name,
        electronVersion: process.versions.electron,
        nodeVersion: process.versions.node,
        chromiumVersion: process.versions.chrome,
        workDirectory: process.cwd(),
        beginPage: langAM[ln].beginPage,
        langAM: langAM[ln]
      });
    })
  })

  // Получение данных структуры шаблона из renderer AccountManagement для сохранения
  ipcMain.on('saveTemplates', (_, arg) => {
    save(arg, 'template', currentPassword);
    currentTemplate = arg;
  })

  // Получение сигнала для полного удаления структуры шаблона (с удалением файла)
  ipcMain.on('deleteTemplates', () => {
    try {
      if (fs.existsSync(PATH_template)) {
        const resultTemplate = fs.unlinkSync(PATH_template);
        // console.log(`Templates is delete ${resultTemplate}`);
      }
      if (fs.existsSync(PATH_data)) {
        const resultData = fs.unlinkSync(PATH_data);
        // console.log(`Data is delete ${resultData}`);
      }
    } catch (error) {
      console.error('### Error in main process during deleting templates: ', error)
    }
    currentTemplate = [];
    currentData = {};
  })

  // Получение данных data из из renderer в результате изменения структуры шаблона для сохранения
  ipcMain.on('saveData', (_, arg) => {
    currentData = arg;
    // save(arg, 'data', currentPassword);
  })

  win.on('closed', () => {
    win = null;

  })

  const tray = new Tray(path.resolve(__dirname, icon));
  tray.setToolTip('Ежедневник');
  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show();
  })
  tray.setContextMenu(Menu.buildFromTemplate(trayMenu(win)));
} // закрытие функции создания окна --------------------------------------------------

export function savePassword(password) {
  try {
    save(hashText(password), 'pas');
    currentPassword = password;
    save(currentData, 'data', currentPassword);
    save(currentTemplate, 'template', currentPassword);
  } catch (error) {
    console.error("### Error to save in function savePassword!", error)
  }
}

if (!gotTheLock) {
  app.quit()
} else {
  // Это событие будет сгенерировано внутри основного экземпляра вашего приложения, когда второй экземпляр будет выполнен и 
  // вызовет app.requestSingleInstanceLock().
  app.on('second-instance', () => win.focus());
  app.whenReady().then(createWindow);
  Menu.setApplicationMenu(Menu.buildFromTemplate(templateMenu));
}

function quitProgram() {
  // console.log('currentPassword: ', currentPassword);
  // console.log('currentData: ', currentData);
  save(currentData, 'data', currentPassword);
  app.quit();
}

// Выбор меню "учёт данных"
function dataAccounting() {
  // console.log('currentData : ', j(currentData));
  win.webContents.send('data_accounting', { template: currentTemplate, data: currentData, langAM: langAM[ln] })
}

// Выбор меню "Управление учётом"
function accountManagement() {
  // if (currentData) {
  //   save(currentData, 'data');
  //   console.log('Saved data: ', JSON.stringify(currentData, null, 2));
  // } else {
  //   console.log('Do not saved: ', currentData);
  // }
  // const temp = currentTemplate ?? load('template') ?? [];
  // console.log('Load account managment :', JSON.stringify(temp, null, 2));
  win.webContents.send('account_management', { template: currentTemplate, data: currentData, langAM: langAM[ln] })
}

function help() {
  win.webContents.send('help', lang.pageHelp[ln])
}

function language(langChange) {
  return function () {
    save(langChange, 'language');
    ln = langChange;
    new Notification({
      title: lang.tm.language[ln],
      body: String(lang.message.langChange[ln])
    }).show();
  }
}


// app.on('before-quit', (event) => {
//   event.preventDefault()
// })

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    // console.log('Window create successfully!');
    createWindow()
  }
})
