import React, { useReducer, useRef, useState } from 'react'
// import { nanoid } from 'nanoid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Popup from 'reactjs-popup';
import OptionProperties from './OptionProperties'
import { SwitchElemData } from './SwitchElemData';
import { TrashSolid } from '../../images/trash-solid';
import { PenToSquareSolid } from '../../images/pen-to-square-solid'
import { Up_arrow } from '../../images/up-arrow';
import { Down_arrow } from '../../images/down-arrow';
import style from '../../stylesheets/accountManagment.module.css'
import 'reactjs-popup/dist/index.css';

/* function j(e) {
    return JSON.stringify(e, null, 2)
} */

export default function AccountManagement({ data: { template, data, langAM } }) {
    // Ссылка на ввод названия поля (используется для очистки инпута)
    let refInputLegend = useRef();
    // Переменна для блокировки кнопки фиксирующей поле
    let fixField = useRef(true);
    // Переменна для блокировки кнопки Add selected option
    let addSelectedOptionButton = useRef(true);
    // Массив всех полей
    const [accountManagement, setAccountManagement] = useState(template);
    // Набор оптионов для текущего поля
    const [addOption, setAddOption] = useState({ options: [] });  // legend: '', options: [{legendOpt: []}] 
    // Для редактирования названия опции в существующем поле
    const [optionNameInField, setOptionNameInField] = useState();
    // Редактирование названия поля в готовом поле при нажатии на legend
    const [nameField, setNameField] = useState();
    // Редактирование названия группы в готовом поле при нажатии на legend раздела группы
    const [nameGroup, setNameGroup] = useState();
    // useReduser для получения объекта свойств выбранной опции
    const [state, dispach] = useReducer(reducer, { type: 'None', legendOpt: '' });
    function reducer(state, action) {
        switch (action.type) {
            //Textarea
            case 'Ta':
                addSelectedOptionButton.current = false;
                return { type: "Ta", legendOpt: action.legendOpt ?? '', label: action.label ?? '', rows: action.rows ?? 70, cols: action.cols ?? 370 }
            //Checkbox
            case 'Cb':
                addSelectedOptionButton.current = false;
                return { type: "Cb", legendOpt: action.legendOpt ?? '', label: action.label ?? '' }
            //Select
            case 'St':
                if (action.arr?.length > 1) { addSelectedOptionButton.current = false } else { addSelectedOptionButton.current = true };
                return { type: "St", legendOpt: action.legendOpt ?? '', label: action.label ?? '', arr: action.arr ?? [] }
            //Time
            case 'Te':
                addSelectedOptionButton.current = false;
                return { type: "Te", legendOpt: action.legendOpt ?? '', label: action.label ?? '' }
            //Number
            case "Nr":
                if ((Math.abs(action.maxNumber - action.minNumber) / Math.abs(action.stepNumber)) >= 1 || !(Object.keys(action).length > 2)) { addSelectedOptionButton.current = false } else { addSelectedOptionButton.current = true };
                return { type: "Nr", legendOpt: action.legendOpt ?? '', label: action.label ?? '', minNumber: action.minNumber ?? 0, maxNumber: action.maxNumber ?? 10, stepNumber: action.stepNumber ?? 1 }
            // Input
            case "It":
                addSelectedOptionButton.current = false;
                // if (action.legendOpt?.length) {addSelectedOptionButton.current = false} else {addSelectedOptionButton.current = true};
                return { type: "It", legendOpt: action.legendOpt ?? '', label: action.label ?? '' }
            // Radio
            case "Ro":
                if (action.arr?.length > 1) { addSelectedOptionButton.current = false } else { addSelectedOptionButton.current = true };
                return { type: "Ro", legendOpt: action.legendOpt ?? '', label: action.label ?? '', arr: action.arr ?? [] }
            // Range
            case "Re":
                // Вторая часть возвращает true если размер словаря = 1 (т.е. первая сработка dispach({type: e.target.value})), чтоб кнопка Add selected option была разблокирована
                if ((action.maxRange - action.minRange) / action.stepRange >= 2 || !(Object.keys(action).length > 2)) { addSelectedOptionButton.current = false } else { addSelectedOptionButton.current = true };
                return { type: "Re", legendOpt: action.legendOpt ?? '', label: action.label ?? '', maxRange: action.maxRange ?? 5, minRange: action.minRange ?? 0, stepRange: action.stepRange ?? 1 }
            default:
                break;
        }
        return action
    }

    // Добавление выборной опции с её настройками в формируемое поле 'Add selected option'
    const addSelectedOption = () => {
        // Ищем введённое название группы (legendOpt) в текущей addOption
        let existGroup = addOption.options.findIndex((o) => {
            if (!state.legendOpt) { // проверяет если legendOpt не вводилось и нет свойства groupOpt
                return !o.hasOwnProperty('groupOpt')
            }
            return o.groupOpt === state.legendOpt
        }); // 

        if (existGroup > -1) {
            // Добавляем в существущий legendOpt новую позицию
            addOption.options[existGroup].legendOpt.push({ ...state, hide: false });
            setAddOption({ ...addOption });
        } else if (state.legendOpt) {
            // Группа не найдена, по этому просто добавляем новый объект options c groupOpt
            addOption.options.push({ groupOpt: state.legendOpt, legendOpt: [{ ...state, hide: false }] });
            setAddOption({ ...addOption });
        } else {
            // Группа не найдена и не введено state.legendOpt
            addOption.options.push({ legendOpt: [{ ...state, hide: false }] });
            setAddOption({ ...addOption });
        }

        // Состояние кнопки Fix для создания поля. Длинну массива не учитываем поскольку полюбому уже больше 1.
        fixField.current = addOption.legend ? false : true;
        dispach({ type: state.type })
    }

    // Добавление записи Fix Field. Окончание формирования addOption
    function addField() {
        addOption.hide = false;
        const findField = accountManagement.findIndex(nField => nField.legend === addOption.legend);
        if (findField > -1) {
            addOption.options.forEach((group) => {
                const findGroup = accountManagement[findField].options.findIndex(nGroup => nGroup?.groupOpt === group?.groupOpt);
                if (findGroup > -1) {
                    accountManagement[findField].options[findGroup].legendOpt.push(...group.legendOpt);
                } else {
                    accountManagement[findField].options.push(group);
                }
            })
        } else {
            accountManagement.push(addOption);
        }
        setAccountManagement([...accountManagement]);
        setAddOption({ legend: '', options: [] });
        refInputLegend.current.value = '';
        fixField.current = true;
        saveAccountManagement();
    }

    // Добавление имени поля по событию onChange
    function addLegend(e) {
        let str = e.target.value.trim();
        fixField.current = addOption.options.length && str ? false : true;
        setAddOption({ legend: str, options: addOption.options })
    }

    // Текущая выбранная опция select
    const selectonChange = (e) => {
        dispach({ type: e.target.value })
    }

    // Спрятать элемент. Реверс отображения флажка checkbox по событию onChange
    const fieldHide = (index, ind, i) => (e) => {
        ind >= 0 || (accountManagement[index].hide = e.target.checked);
        i >= 0 || ind >= 0 && (accountManagement[index].options[ind].hide = e.target.checked);
        i >= 0 && (accountManagement[index].options[ind].legendOpt[i].hide = e.target.checked);
        setAccountManagement([...accountManagement]);
        saveAccountManagement();
    }

    function saveAccountManagement(am = accountManagement) {
        window.MessageToMain.setApi_account_management(am);
    }

    function saveDataAccaunting(dt = data) {
        window.MessageToMain.setApi_data_accaunting(dt);
    };

    function deleteAccountManagement() {
        window.MessageToMain.deleteApi_account_management();
        setAccountManagement([]);
    }

    // Функция меняет местами позиции в массиве
    const rotate = (arr, indexSource, indexDestination, arrLength = arr.length) => {
        try {
            if (!arr || !arr.length || indexSource < 0 || indexDestination < 0 || indexDestination >= arrLength || indexSource >= arrLength || arr?.[indexSource] === undefined && arr?.[indexDestination] === undefined) {
                return true
            }
            if (indexSource > indexDestination) [indexSource, indexDestination] = [indexDestination, indexSource];
            if (arr?.[indexDestination] === undefined) arr[indexDestination] = null;
            [arr[indexDestination], arr[indexSource]] = [arr[indexSource], arr[indexDestination]];
            return true
        } catch (error) {
            console.error(error)
            return false;
        }
    }

    // Выполняет вставку элемента массива в указанное место, всё остальное сдвигается
    const moving = (arr, indexSource, indexDestination, arrLength = arr.length) => {
        try {
            if (!arr || !arr.length || indexSource < 0 || indexDestination < 0 || indexDestination >= arrLength || indexSource >= arrLength || arr?.[indexSource] === undefined && arr?.[indexDestination] === undefined) {
                return true
            }
            if (indexSource > indexDestination) {
                let del = arr.splice(indexSource, 1);
                del = del.length === 0 ? null : del[0];
                arr.splice(indexDestination, 0, del)
                } else {
                    if (arr.length < indexDestination + 1) arr.length = indexDestination + 1;
                    arr.splice(indexDestination + 1, 0, arr[indexSource]);
                    arr.splice(indexSource, 1);
                }
            return true
        } catch (error) {
            console.error(error)
            return false;
        }
    }

    // Перетягивание полей
    function handleonDragEnd(e) {
        const { source: { index: indexSource }, destination: { index: indexDestination } } = e;
        moving(accountManagement, indexSource, indexDestination);
        setAccountManagement([...accountManagement]);
        for (const i in data) {
            // Ротируем. i - ключи-даты. data[i] - значения-массивы данных.
            moving(data[i], indexSource, indexDestination, accountManagement.length);
        };
        saveAccountManagement();
        saveDataAccaunting();
    }

    // Удаление добавленной опции, но не зафиксированной в поле
    const delOption = (index, ind) => () => setAddOption((addOption.options[index].legendOpt.splice(ind, 1), addOption.options[index].legendOpt.length === 0 && addOption.options.splice(index, 1), { ...addOption }));

    // Редактирование добавленной опции, но не зафиксированной в поле
    const editOption = (index, ind) => () => {
        dispach(addOption.options[index].legendOpt[ind]);
        addOption.options[index].legendOpt.splice(ind, 1);
        if (addOption.options[index].legendOpt.length === 0) {
            addOption.options.splice(index, 1)
        }
        setAddOption({ ...addOption });
    }

    // Удаление опции из существующего поля (из объекта accountManagement и data)
    const delOptionField = (index, ind, i) => () => {
        // console.log('index, ind, i: ', index, ind, i);
        accountManagement[index].options[ind].legendOpt.splice(i, 1)
        Object.keys(data).forEach((key) => {
            data[key]?.[index]?.[ind].splice(i, 1);
        })
        if (accountManagement[index].options[ind].legendOpt.length === 0) {
            // console.log('Удалена группа', index, ind, i);
            accountManagement[index].options.splice(ind, 1)
        }
        if (accountManagement[index].options.length === 0) {
            accountManagement.splice(index, 1)
            // console.log('Удалено поле');
        }
        setAccountManagement([...accountManagement]);
        saveAccountManagement();
        saveDataAccaunting();
    }

    // Редактирование имени опции при нажатии на карандаш 
    const editNameInField = (index, ind, i) => {
        accountManagement[index].options[ind].legendOpt[i].label = optionNameInField;
        setAccountManagement([...accountManagement]);
        saveAccountManagement();
    }

    // При нажатии на legend - редактирование имени поля в готовом поле
    const editNameField = (index) => {
        accountManagement[index].legend = nameField;
        setAccountManagement([...accountManagement]);
        saveAccountManagement();
    }

    // При нажатии на legend - редактирование имени группы в готовом поле
    const editNameGroup = (index, ind) => {
        // Необходимо совместить группы, если они миеют одинаковые имена
        const findGroupName = accountManagement[index].options.findIndex((e) => e.groupOpt === nameGroup);
        if (findGroupName > -1) {
            // Получаем в переменную grFragment группу которую переименовали.
            const grFragment = accountManagement[index].options[ind];
            // В группе меняем название LegendOpt для каждого элемента массива - {type: 'Nr', legendOpt: 'gr', label: '1', minNumber: 0, maxNumber: 10, …}
            grFragment.legendOpt.forEach((e) => e.legendOpt = nameGroup);
            // Добавляем в существующую группу переименованную группу
            accountManagement[index].options[findGroupName].legendOpt.push(...grFragment.legendOpt);
            // После всех операций во избежание смещения позиций массива удаляем переименованную группу
            accountManagement[index].options.splice(ind, 1);
            // Аналогично делаем с Data
            Object.keys(data).forEach((e) => {
                // Получаем в переменную grFragment группу которую переименовали.
                const fragmentData = data[e][index][ind];
                // Добавляем в существующую группу переименованную группу
                data[e][index][findGroupName].push(...fragmentData);
                // После всех операций во избежание смещения позиций массива удаляем переименованную группу
                data[e][index].splice(ind, 1);
            })
            // Сохраняем Data
            saveDataAccaunting();
        } else {
            accountManagement[index].options[ind].groupOpt = nameGroup;
        }
        setAccountManagement([...accountManagement]);
        saveAccountManagement();
    }

    // Передвинуть вверх элемент в заготовке поля
    const upOption = (index, ind) => () => {
        rotate(addOption.options[index].legendOpt, ind, ind - 1);
        setAddOption({ ...addOption });
    }

    // Передвинуть вниз элемент в заготовке поля
    const downOption = (index, ind) => () => {
        rotate(addOption.options[index].legendOpt, ind, ind + 1);
        setAddOption({ ...addOption });
    }

    // Передвинуть элемент вверх в поле
    const upOptionInField = (index, ind, i) => () => {
        // Сначала ротируем в шаблоне, длинну массива не нужно передавать
        if (rotate(accountManagement[index].options[ind].legendOpt, i, i - 1)) {
            setAccountManagement([...accountManagement]);
            // Ротируем в учёте данных по всем ключам-датам
            for (const d in data) {
                // Тут передаём длинну массива шаблона
                if (!rotate(data[d]?.[index]?.[ind], i, i - 1, accountManagement[index].options[ind].legendOpt.length)) throw new Error('Ошибка ротации в учёте данных');
            }
            saveAccountManagement();
            saveDataAccaunting();
        }
    }

    // Передвинуть вниз элемент поля
    const downOptionInField = (index, ind, i) => () => {
        if (rotate(accountManagement[index].options[ind].legendOpt, i, i + 1)) {
            setAccountManagement([...accountManagement]);
            for (const d in data) {
                // Тут передаём длинну массива шаблона
                if (!rotate(data[d]?.[index]?.[ind], i, i + 1, accountManagement[index].options[ind].legendOpt.length)) throw new Error('Ошибка ротации в учёте данных');
            }
            saveAccountManagement();
            saveDataAccaunting();
        }
    }

    return (
        <div>
            {/* Форма добавления */}
            <select onChange={selectonChange}>
                <option value='None'>---</option>
                <option value='Ta'>Text field</option>
                <option value='Te'>Time</option>
                <option value='Cb'>Check box</option>
                <option value='It'>Input</option>
                <option value='Nr'>Number</option>
                <option value='Re'>Range</option>
                <option value='Ro'>Radio</option>
                <option value='St'>Select</option>
            </select>
            <button onClick={addSelectedOption} disabled={addSelectedOptionButton.current} className={style.addSelectedOption}>{langAM.addSelectedOption}</button>
            {/* Пользовательский компонент для настройки текущей опции */}
            <OptionProperties dispach={dispach} state={state} langAM={langAM} />

            <hr />

            {/* Поле с набранными опциями для дальнейшей фиксации */}
            {addOption?.options?.[0]?.legendOpt?.length ?
                <fieldset>
                    <legend>{addOption.legend ? addOption.legend : `${langAM.noName}`}</legend>
                    <label>{langAM.nameField}
                        <input placeholder={langAM.placeholderNameField} onChange={addLegend} ref={refInputLegend} />
                    </label>
                    {addOption.options.map((element, index) => { //Обход по массиву options (по группам)
                        if (element.groupOpt) {
                            return <fieldset key={index} style={{ position: 'relative' }}>
                                <legend>{element.groupOpt}</legend>
                                {element.legendOpt.map((elem, ind) => { //Обход по массиву legendOpt (по опциям)
                                    return <div key={ind} className={style.divContainer}>
                                        <div>
                                            <SwitchElemData elem={elem} index={ind} index_={index} langAM={langAM} />
                                        </div>
                                        <div onClick={upOption(index, ind)} title={langAM.upArrow}><Up_arrow className={style.up_arrow} /></div>
                                        <div onClick={downOption(index, ind)} title={langAM.downArrow}><Down_arrow className={style.up_arrow} /></div>
                                        <div onClick={editOption(index, ind)} title={langAM.editOption} className={style.divPen}><PenToSquareSolid className={style.pen} /></div>
                                        <div onClick={delOption(index, ind)} title={langAM.deleteOption} className={style.divTrashSolid}><TrashSolid className={style.trashSolid} /></div>
                                    </div>
                                })}
                            </fieldset>
                        } else {
                            return element.legendOpt.map((elem, ind) => ( //Обход по массиву legendOpt (по опциям)
                                <fieldset key={ind} className={style.divContainer}>
                                    <div>
                                        <SwitchElemData elem={elem} index={ind} index_={index} langAM={langAM} />
                                    </div>
                                    <div onClick={upOption(index, ind)} title={langAM.upArrow}><Up_arrow className={style.up_arrow} /></div>
                                    <div onClick={downOption(index, ind)} title={langAM.downArrow}><Down_arrow className={style.up_arrow} /></div>
                                    <div onClick={editOption(index, ind)} title={langAM.editOption} className={style.divPen}><PenToSquareSolid className={style.pen} /></div>
                                    <div onClick={delOption(index, ind)} title={langAM.deleteOption} className={style.divTrashSolid}><TrashSolid className={style.trashSolid} /></div>
                                </fieldset>
                            ))
                        }
                    })}
                    <br />
                    <button onClick={addField} disabled={fixField.current}>{langAM.fixField}</button>
                </fieldset > : <p>{langAM.noOption}</p>
            }

            <hr />

            {/* Добавленные поля */}
            <button onClick={deleteAccountManagement}>{langAM.delAllFields}</button>

            <DragDropContext onDragEnd={handleonDragEnd}>
                <Droppable droppableId='legendOpt' type='field'>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {accountManagement.map((field, index) => ( //Проход по полю
                                <Draggable key={index} draggableId={index.toString()} index={index}>
                                    {(provided2) => (
                                        <div
                                            ref={provided2.innerRef}
                                            {...provided2.draggableProps}
                                            {...provided2.dragHandleProps}>
                                            <fieldset>
                                                <Popup
                                                    trigger={<legend><div onClick={() => setNameField(accountManagement[index].legend)}>{field.legend}</div></legend>}
                                                    position="right top">
                                                    {close => (<div className='modal'>
                                                        <input value={nameField} onChange={e => setNameField(e.target.value)} />
                                                        <button onClick={() => { editNameField(index); close() }}>{langAM.save}</button>
                                                        <button onClick={close}>{langAM.close}</button>
                                                    </div>)}
                                                </Popup>
                                                <label>
                                                    <input type='checkbox' checked={field.hide} onChange={fieldHide(index)} />
                                                    <span className='hide'>{langAM.hideField}</span>
                                                </label>
                                                {field.options.map((group, ind) => { //Проход по группам из поля
                                                    if (group.groupOpt) {
                                                        return <fieldset key={ind}>
                                                            <Popup
                                                                trigger={<legend><div onClick={() => setNameGroup(accountManagement[index].options[ind].groupOpt)}>{group.groupOpt}</div></legend>}
                                                                position="right top">
                                                                {close => (<div className='modal'>
                                                                    <input value={nameGroup} onChange={e => setNameGroup(e.target.value)} />
                                                                    <button onClick={() => { editNameGroup(index, ind); close() }}>{langAM.save}</button>
                                                                    <button onClick={close}>{langAM.close}</button>
                                                                </div>)}
                                                            </Popup>
                                                            {group.legendOpt.length > 1 &&
                                                                <label>
                                                                    <input type='checkbox' checked={group.hide} onChange={fieldHide(index, ind)} />
                                                                    <span className='hide'>{langAM.hideGroup}</span>
                                                                </label>}
                                                            {group.legendOpt.map((opt, i) => { // Проход по опциям из поля
                                                                return <div key={i} className={style.divContainer}>
                                                                    <div>
                                                                        {i > 0 && group.legendOpt.length > i && <hr/>}
                                                                        <SwitchElemData elem={opt} index={i} index_={ind} langAM={langAM} />
                                                                    </div>
                                                                    <div title={langAM.upArrow} onClick={upOptionInField(index, ind, i)}><Up_arrow className={style.up_arrow} /></div>
                                                                    <div title={langAM.downArrow} onClick={downOptionInField(index, ind, i)}><Down_arrow className={style.up_arrow} /></div>
                                                                    <Popup
                                                                        trigger={
                                                                            <div title={langAM.editOption} className={style.divPen}><PenToSquareSolid onClick={() => setOptionNameInField(accountManagement[index].options[ind].legendOpt[i].label)} className={style.pen} /></div>
                                                                        }
                                                                        position="left center">
                                                                        {close => (<div className='modal'>
                                                                            <input value={optionNameInField} onChange={e => setOptionNameInField(e.target.value)} />
                                                                            <button onClick={() => { editNameInField(index, ind, i); close() }}>{langAM.save}</button>
                                                                            <button onClick={close}>{langAM.close}</button>
                                                                        </div>)}
                                                                    </Popup>

                                                                    <div onClick={delOptionField(index, ind, i)} title={langAM.deleteOption} className={style.divTrashSolid}><TrashSolid className={style.trashSolid} /></div>

                                                                    <label>
                                                                        <input type='checkbox' checked={opt.hide} onChange={fieldHide(index, ind, i)} />
                                                                        <span className='hide'>{langAM.hideElement}</span>
                                                                    </label>
                                                                </div>
                                                            })}
                                                        </fieldset>
                                                    } else {
                                                        return <fieldset key={ind}>
                                                            {group.legendOpt.map((opt, i) => {
                                                                return <div key={i} className={style.divContainer}>
                                                                    <div>
                                                                        {i > 0 && group.legendOpt.length > i && <hr/>}
                                                                        <SwitchElemData elem={opt} index={i} index_={ind} langAM={langAM} />
                                                                    </div>
                                                                    <div title={langAM.upArrow} onClick={upOptionInField(index, ind, i)}><Up_arrow className={style.up_arrow} /></div>
                                                                    <div title={langAM.downArrow} onClick={downOptionInField(index, ind, i)}><Down_arrow className={style.up_arrow} /></div>
                                                                    <Popup
                                                                        trigger={
                                                                            <div title={langAM.editOption} className={style.divPen}><PenToSquareSolid onClick={() => setOptionNameInField(accountManagement[index].options[ind].legendOpt[i].label)} className={style.pen} /></div>
                                                                        }
                                                                        position="left center">
                                                                        {close => (<div className='modal'>
                                                                            <input value={optionNameInField} onChange={e => setOptionNameInField(e.target.value)} />
                                                                            <button onClick={() => { editNameInField(index, ind, i); close() }}>{langAM.save}</button>
                                                                            <button onClick={close}> {langAM.close}</button>
                                                                        </div>)}
                                                                    </Popup>

                                                                    <div onClick={delOptionField(index, ind, i)} title={langAM.deleteOption} className={style.divTrashSolid}><TrashSolid className={style.trashSolid} /></div>

                                                                    <label>
                                                                        <input type='checkbox' checked={opt.hide} onChange={fieldHide(index, ind, i)} />
                                                                        <span className='hide'>{langAM.hideElement}</span>
                                                                    </label>
                                                                </div>
                                                            })}
                                                        </fieldset>
                                                    }
                                                })}
                                            </fieldset>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {accountManagement.length === 0 && <p>{langAM.msgFixField}</p>}
        </div >
    )
}


