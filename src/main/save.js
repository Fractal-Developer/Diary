import path from 'path'
const fs = require('fs')
import encrypt from './encrypt'

// Сохранение данных или шаблона
export default function save(params, file, password) {
  try {
    const pathDirectory = path.join(process.cwd(), 'JsonStorage');
    if (!fs.existsSync(pathDirectory)) {
      fs.mkdirSync(pathDirectory);
    } else {
    }
    const pathFile = path.join(pathDirectory, file);
    const fd = fs.openSync(pathFile, 'w'); // открываем файл для записи
    const buffer = Buffer.from(encrypt(JSON.stringify(params), password)); // преобразуем данные в буфер
    const bytesWritten = fs.writeSync(fd, buffer); // записываем данные в файл
    // console.log(`Butes ${bytesWritten}. Save data ${params} to file ${file} successfuly...`);
    fs.closeSync(fd); // закрываем файловый дескриптор
  } catch (error) {
    console.error('### Error in save function', error);
  };
}