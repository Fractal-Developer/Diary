// https://electronjs.org/docs/tutorial/security
// Preload File that should be loaded into browser window instead of
// setting nodeIntegration: true for browser window

import { contextBridge, ipcRenderer } from 'electron'

//Отправка из main в renderer и preload
contextBridge.exposeInMainWorld('MessagesFromMain', {
  onLoaded: callback => {
    ipcRenderer.on('loaded', callback)
  },
  api_data_accaunting: callback => {
    ipcRenderer.on('data_accounting', callback)
  },
  api_account_management: callback => {
    //Прослушка от main процесса. В callback приходят данные от main процесса.
    //А в callback подставляется функция из renderer процесса.
    ipcRenderer.on('account_management', callback)
  },
  help: callback => {
    ipcRenderer.on('help', callback)
  }
})

//Отправка из renderer и preload в main
contextBridge.exposeInMainWorld('MessageToMain', {
  setApi_account_management: callback => {
    ipcRenderer.send('saveTemplates', callback)
  },
  deleteApi_account_management: callback => {
    ipcRenderer.send('deleteTemplates', callback)
  },
  setApi_data_accaunting: callback => {
    ipcRenderer.send('saveData', callback)
  },
  passClick: callback => {
    ipcRenderer.send('passClick', callback)
  },
  exit: () => {
    ipcRenderer.send('exit')
  },
  cancel: () => {
    ipcRenderer.send('cancel')
  }
})





