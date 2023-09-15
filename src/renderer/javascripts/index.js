import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App'
import '../stylesheets/global.css'

window.MessagesFromMain.onLoaded((event, data) => {
  // console.log('Resive data :', event, data.electronVersion);
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App beginPage={data}/>);
})
/*   document.getElementById('title').innerHTML = data.appName + ' App'
  document.getElementById('details').innerHTML = 'built with Electron v' + data.electronVersion
  document.getElementById('versions').innerHTML = 'running on Node v' + data.nodeVersion + ' and Chromium v' + data.chromiumVersion */

