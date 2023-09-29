import React, { useEffect, useRef, useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import { SwitchElemData } from './SwitchElemData';
import ru from 'date-fns/locale/ru';
import uk from 'date-fns/locale/uk';
import en from 'date-fns/locale/en-US';
import TrashSolid from '../../assets/trash.svg';
import 'react-datepicker/dist/react-datepicker.css';
import style from '../../stylesheets/dataAccaunting.module.css';
import pin from '../../assets/pin.png';
import unpin from '../../assets/unpin.png';
import eyeOpen from '../../assets/eyeOpen.png';
import eyeClosed from '../../assets/eyeClosed.png';
import arrowRight from '../../assets/arrowRight.png';
import arrowLeft from '../../assets/arrowLeft.png';


// registerLocale("ru", ru)
// setDefaultLocale(ru); Как вариант
function j(e) {
  return JSON.stringify(e, null, 2)
}

export default function DataAccaunting({ data: { data, template, langAM } }) {
  // Данные [{'31.12.2022': [['a', 12], ['b', 16]]}, {'24.05.2023': [['e', 12], ['h', 16]]}
  const [value, setValue] = useState(data);

  // Преобразование даты в строку
  function toDateString(date = new Date()) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("ru-RU", options);
  }

  // Преобразование строки в дату
  const toDateObj = (date) => date ? new Date(date.split('.').reverse().join('-')) : new Date();

  // Текущая дата для календаря
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Фиксация календаря
  const [fix, setFix] = useState(false);

  // Отображение календаря
  const [eye, setEye] = useState(true); // глаз открыт и календарь отображается

  // Расположение календаря
  const [position, setPosition] = useState(true) // true слева, false справа

  // Отображаемые даты в виде массива объектов даты
  function highlightedDatesF() {
    return Object.entries(value).map(([key, obj]) => obj.some(a1 => a1 instanceof Array ? a1.some(a2 => a2 instanceof Array ? a2.some(a3 => a3) : a2) : a1) ? toDateObj(key) : null).filter(e => e);
  }

  // Каждый раз получаем актуальную строку даты
  const currentDateString = toDateString(currentDate);

  // Установка значения опции
  const setValueElem = (index, ind, i, elem) => (event) => {
    let e;
    if (elem === 'Cb') {
      e = event.target.checked.toString();
    } else {
      e = event.target.value.trimStart();
    }
    const newData = { ...value };
    // Проверяем наличие полей
    if (!newData[currentDateString]?.length) newData[currentDateString] = [[[]]];
    // Проверяем наличие групп
    if (!newData[currentDateString][index]?.length) newData[currentDateString][index] = [[]];
    //Проверяем наличие опций
    if (!newData[currentDateString][index][ind]?.length) newData[currentDateString][index][ind] = [];
    // Присваиваем значение ввода в объект сохранения
    newData[currentDateString][index][ind][i] = e;
    setValue(newData);
    window.MessageToMain.setApi_data_accaunting(newData)
  }

  // Извлечение значения для опций
  function valueExtraction(index, ind, i) {
    if (Object.keys(value).includes(currentDateString)) { // проверяем наличие свойства в виде текущей даты
      if (value[currentDateString]?.length && value[currentDateString][index]?.length && value[currentDateString][index][ind]?.length && value[currentDateString][index][ind][i]?.length) {
        return value[currentDateString][index][ind][i]
      }
    }
    return ''
  }

  // Удаление всех полей и маркера текущей даты
  function delMarker() {
    const newData = { ...value };
    delete newData[currentDateString];
    setValue(newData);
    window.MessageToMain.setApi_data_accaunting(newData);
  }

  // Функция расположения элементов
  function eyeFun() {
    const dashbord = document.querySelector(`.${style.dashbord}`);
    const icon = document.querySelectorAll(`.${style.icon}`);
    if (eye) {
      dashbord.style.setProperty('flex-direction', 'row');
      dashbord.style.setProperty('width', 'auto');
      dashbord.style.setProperty('padding', '0 2px');
      icon.forEach((e) => e.style.setProperty('margin', '0 10px'));
     } else {
       dashbord.style.setProperty('flex-direction', 'column');
       dashbord.style.setProperty('width', '28px');
       icon.forEach((e) => e.style.setProperty('margin', '30px 0 0 0'));
     }
    setEye(!eye);
  }

  // Функция расположения элементов
  function positionFun() {
    const dataPickerConteinerStatic = fix ? document.querySelector(`.${style.dataPickerConteinerFix}`) : document.querySelector(`.${style.dataPickerConteinerStatic}`)
    if (position) {
      dataPickerConteinerStatic.style.setProperty('flex-direction', 'row-reverse');
      fix ? dataPickerConteinerStatic.style.setProperty('right', '5px') : null;
    } else {
      dataPickerConteinerStatic.style.setProperty('flex-direction', 'row');
      fix ? dataPickerConteinerStatic.style.setProperty('left', '5px') : null;
    }
    setPosition(!position);
  }

  // Присвоение переменной локализации календаря соотвествующей локализации
  let ln;
  switch (langAM.ln) {
    case 'en':
      ln = en;
      break;
    case 'uk':
      ln = uk;
      break;
    case 'ru':
      ln = ru;
      break;
    default:
      ln = en;
      break;
  }

  return <div>
    <div className={fix ? style.dataPickerConteinerFix : style.dataPickerConteinerStatic}>
      <DatePicker
        className={style.datePicker}
        selected={currentDate}
        onChange={date => setCurrentDate(date)}
        // peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        locale={ln}
        dateFormat="dd/MM/yyyy"
        highlightDates={highlightedDatesF()}
        inline={eye}
      // withPortal
      // selectOtherMonths
      />
      <div className={style.dashbord}>
        <img src={fix ? pin : unpin} alt='pin' className={style.icon} onClick={() => setFix(!fix)} />
        <img src={eye ? eyeOpen : eyeClosed} alt='eye' className={style.icon} onClick={eyeFun} />
        <img src={position ? arrowRight : arrowLeft} alt='position' className={style.icon} onClick={positionFun} />
        <img src={TrashSolid} alt="Trash Icon" className={style.icon} onClick={delMarker} title='Удаляет все поля из текущей даты и убирает маркер'/>
      </div>
    </div>

    <div className={fix ? eye ? style.conteinerDataFixMax : style.conteinerDataFixMin : style.conteinerDataStatic}>
      {/* Проход по массиву полей */}
      {template.map((field, index) => {
        if (!field.hide) return <fieldset key={index}>
          <legend>{field.legend}</legend>
          {field.options.map((group, ind) => { //Обход по массиву options (по группам)
            if (group.groupOpt && !group.hide) {
              return <fieldset key={ind}>
                <legend>{group.groupOpt}</legend>
                {group.legendOpt.map((option, i, curArr) => { //Обход по массиву legendOpt
                  return <div key={i}>
                    {i > 0 && curArr.length > i && curArr?.[i]?.hide === false && curArr.some((e, ix) => (e.hide === false && ix < i)) && <hr />}
                    {!option.hide && <SwitchElemData langAM={langAM} elem={option} index={i} index_={ind} valueExtraction={valueExtraction(index, ind, i)} setValueElem={setValueElem(index, ind, i, option.type)} />}
                  </div>
                })}
              </fieldset>
            } else if (!group.hide) {
              return group.legendOpt.map((option, i, curArr) => { //Обход по массиву legendOpt
                return <div key={i}>
                  {i > 0 && curArr.length > i && curArr?.[i]?.hide === false && curArr.some((e, ix) => (e.hide === false && ix < i)) && <hr />}
                  {!option.hide && <SwitchElemData langAM={langAM} elem={option} index={i} index_={ind} valueExtraction={valueExtraction(index, ind, i)} setValueElem={setValueElem(index, ind, i, option.type)} />}
                </div>
              })
            }
          })}
        </fieldset>
      })}
    </div>
  </div>
}
