import path from 'path'
const fs = require('fs')
import decrypt from './decrypt'

//Загрузка данных или шаблона
export default function load(file, password) {
  try {
    const pathFile = path.join(process.cwd(), 'JsonStorage', file);
    if (fs.existsSync(pathFile)) {
      const fd = fs.openSync(pathFile, 'r'); // открываем файл для чтения
      const loadData = fs.readFileSync(fd, 'utf8'); // Читаем данные из файла
      // console.log(`Load data ${loadData} from file "${pathFile}" successfuly...`);
      fs.closeSync(fd); // закрываем файловый дескриптор
      return JSON.parse(decrypt(loadData || null, password))
    }
    // console.log(`File ${path} of data not found!`);
    return null
  } catch (error) {
    console.error('### Error in save function: ', error);
  }
}