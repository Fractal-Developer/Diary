import React, { useEffect, useRef, useState } from 'react'

// Пользовательский компонент, предоставляющий настроку выбранной опции
export default function OptionProperties({ dispach, state, langAM }) {
    // для radio и select контролируемый ввод названия item
    const [addSelectItemDisabled, setAddSelectItemDisabled] = useState('');
    // Добавление item для radio и select
    function addItem() {
        dispach({ ...state, arr: [...state.arr, addSelectItemDisabled.trimEnd()] })
        // Обнуление поля ввода item
        setAddSelectItemDisabled('')
    }
    // Общая функция для ввода легенды опции
    function legendOpt(e) {
        dispach({ ...state, legendOpt: e.target.value })
    }
    //Общая функция для ввода лейбы опции
    function label(e) {
        dispach({ ...state, label: e.target.value })
    }
    //Привязка к textarea
    let textareaRef = useRef(null)

    // Привязка слушателя к useRef textarea
    useEffect(() => {
        let textarea = textareaRef.current;
        if (textarea) {
            textarea.addEventListener("click", handleResize); // Добавляем обработчик события     
        }
        function handleResize() {
            if (textarea) {
                const width = textarea.clientWidth;
                const height = textarea.clientHeight;
                dispach({ ...state, rows: height, cols: width });
            }
        }
        return () => { // Удаляем обработчик события
            if (textarea) {
                textarea.removeEventListener("click", handleResize)
            }
        }
    }, [state.type === 'Ta' ? true : false]);
    // ###################################################################################################################
    switch (state.type) {
        // ---------------------------------------------- Textarea ----------------------------------------------
        case 'Ta':
            return <div>
                <fieldset>
                    <h4>{langAM.setElement} Textarea</h4>
                    {state.legendOpt && <legend>{state.legendOpt}</legend>}
                    <span>{langAM.enterNameGroup}: </span>
                    <input onChange={legendOpt} value={state.legendOpt} placeholder={langAM.enterNameGroup} autoFocus></input>
                    <br />
                    <span>{langAM.enterNameElement}: </span>
                    <input onChange={label} value={state.label} placeholder={langAM.enterNameElement} />
                    <br />
                    <p>{state.label && <span>{state.label}:</span>}</p>
                    <textarea ref={textareaRef} style={{ height: state.rows, width: state.cols, maxWidth: "1490px", maxWidth: "500px" }} />
                    <p>{langAM.rows}: {state.rows} {langAM.cols}: {state.cols} </p>
                    <label>{langAM.rows}: <input type='number' value={state.rows} onChange={(e) => dispach({ ...state, rows: Number(e.target.value) })} /></label>
                    <br />
                    <label>{langAM.cols}: <input type='number' value={state.cols} onChange={(e) => dispach({ ...state, cols: Number(e.target.value) })} /></label>
                </fieldset>
            </div>
        // ---------------------------------------------- Checkbox ----------------------------------------------
        case 'Cb':
            return <div>
                <fieldset>
                    <h4>{langAM.setElement} Checkbox</h4>
                    {state.legendOpt && <legend>{state.legendOpt}</legend>}
                    <span>{langAM.enterNameGroup}: </span>
                    <input onChange={legendOpt} value={state?.legendOpt} placeholder={langAM.enterNameGroup} autoFocus></input>
                    <br />
                    <span>{langAM.enterNameElement}: </span>
                    <input onChange={label} value={state.label} placeholder={langAM.enterNameElement}/>
                    <br />
                    <label>{state.label && <span>{state.label}: </span>} <input type='checkbox' /></label>
                </fieldset>
            </div>

        // ---------------------------------------------- Time ----------------------------------------------
        case 'Te':
            return <div>
                <fieldset>
                    <h4>{langAM.setElement} Time</h4>
                    {state.legendOpt && <legend>{state.legendOpt}</legend>}
                    <span>{langAM.enterNameGroup}: </span>
                    <input onChange={legendOpt} value={state?.legendOpt} placeholder={langAM.enterNameGroup} autoFocus></input>
                    <br />
                    <span>{langAM.enterNameElement}: </span>
                    <input onChange={label} value={state.label} placeholder={langAM.enterNameElement}/>
                    <br />
                    <label>{state.label && <span>{state.label}: </span>} <input type='time' /></label>
                </fieldset>
            </div>

        // ---------------------------------------------- Input ----------------------------------------------
        case 'It':
            return <div>
                <fieldset>
                    <h4>{langAM.setElement} Input</h4>
                    {state.legendOpt && <legend>{state.legendOpt}</legend>}
                    <span>{langAM.enterNameGroup}: </span>
                    <input onChange={legendOpt} value={state?.legendOpt} placeholder={langAM.enterNameGroup} autoFocus></input>
                    <br />
                    <label>{state.label && <span>{state.label}: </span>} <input value={state.label} onChange={label} type='text' placeholder={langAM.enterNameElement} /></label>
                </fieldset>
            </div>

        // ---------------------------------------------- Number ----------------------------------------------
        case 'Nr':
            return <div>
                <fieldset>
                    <h4>{langAM.setElement} Number</h4>
                    {state.legendOpt && <legend>{state.legendOpt}</legend>}
                    <span>{langAM.enterNameGroup}: </span>
                    <input onChange={legendOpt} value={state?.legendOpt} placeholder={langAM.enterNameGroup} autoFocus></input>
                    <br />
                    <span>{langAM.enterNameElement}: </span>
                    <input onChange={label} value={state.label} placeholder={langAM.enterNameElement} />
                    <br />
                    <label>{state.label && <span>{state.label}: </span>} {state.minNumber} <input type='number' max={state.maxNumber} min={state.minNumber} step={state.stepNumber} />{state.maxNumber}</label>
                    <p>{langAM.switchElemStep}: {state.stepNumber} {langAM.switchElemMin}: {state.minNumber} {langAM.switchElemMax}: {state.maxNumber}</p>
                    <label>{langAM.switchElemMax}: <input type='number' value={state.maxNumber} onChange={(e) => dispach({ ...state, maxNumber: e.target.value })} /></label>
                    <br />
                    <label>{langAM.switchElemMin}: <input type='number' value={state.minNumber} onChange={(e) => dispach({ ...state, minNumber: e.target.value })} /></label>
                    <br />
                    <label>{langAM.switchElemStep}: <input type='number' value={state.stepNumber} onChange={(e) => dispach({ ...state, stepNumber: e.target.value })} /></label>
                </fieldset>
            </div>

        // ---------------------------------------------- Range ----------------------------------------------
        case 'Re':
            return <div>
                <fieldset>
                    <h4>{langAM.setElement} Range</h4>
                    {state.legendOpt && <legend>{state.legendOpt}</legend>}
                    <span>{langAM.enterNameGroup}: </span>
                    <input onChange={legendOpt} value={state.legendOpt} placeholder={langAM.enterNameGroup} autoFocus></input>
                    <br />
                    <span>{langAM.enterNameElement}: </span>
                    <input onChange={label} value={state.label} placeholder={langAM.enterNameElement} />
                    <p>{state.label && <span>{state.label}:</span>}</p>
                    {state.minRange}
                    <input type='range'  max={state?.maxRange??10} min={state?.minRange??0} step={state?.stepRange??1}/> 
                    {state.maxRange}
                    <p>{langAM.switchElemStep}: {state.stepRange} {langAM.switchElemMin}: {state.minRange} {langAM.switchElemMax}: {state.maxRange}</p>
                    <label>{langAM.switchElemMax}: <input type='number' value={state.maxRange} onChange={(e) => dispach({ ...state, type: "Re", maxRange: Number(e.target.value) })} /></label>
                    <br />
                    <label>{langAM.switchElemMin}: <input type='number' value={state.minRange} onChange={(e) => dispach({ ...state, type: "Re", minRange: Number(e.target.value) })} /></label>
                    <br />
                    <label>{langAM.switchElemStep}: <input type='number' value={state.stepRange} onChange={(e) => dispach({ ...state, type: "Re", stepRange: Number(e.target.value) })} /></label>
                </fieldset>
            </div>

        // ---------------------------------------------- Radio ----------------------------------------------
        case 'Ro':
            return <div>
                <fieldset>
                    <h4>{langAM.setElement} Radio</h4>
                    {state.legendOpt && <legend>{state.legendOpt}</legend>}
                    <span>{langAM.enterNameGroup}: </span>
                    <input onChange={legendOpt} value={state?.legendOpt} placeholder={langAM.enterNameGroup} autoFocus/>
                    <br />
                    <span>{langAM.enterNameElement}: </span>
                    <input onChange={label} value={state.label} placeholder={langAM.enterNameElement} />
                    <br />
                    <p>{state.label && <span>{state.label}:</span>}</p>
                    {state?.arr.map((elem, ind) => {
                        return <div key={ind}><input type="radio" name="radio" />{elem}<br /></div>
                    })}
                    <input value={addSelectItemDisabled} onChange={(e) => setAddSelectItemDisabled(e.target.value.trimStart())} placeholder={langAM.nameOptionSelect} size={25}></input>
                    <button disabled={!addSelectItemDisabled} onClick={addItem}>{langAM.addItem}</button>
                </fieldset>
            </div>

        // ---------------------------------------------- Select ----------------------------------------------
        case 'St':
            return <div>
                <fieldset>
                    <h4>{langAM.setElement} Select</h4>
                    {state.legendOpt && <legend>{state.legendOpt}</legend>}
                    <span>{langAM.enterNameGroup}: </span>
                    <input onChange={legendOpt} value={state?.legendOpt} placeholder={langAM.enterNameGroup} autoFocus/>
                    <br />
                    <span>{langAM.enterNameElement}: </span>
                    <input onChange={label} value={state.label} placeholder={langAM.enterNameElement} />
                    <br />
                    <p>{state.label && <span>{state.label}:</span>}</p>
                    <select>
                        {state?.arr.map((elem, ind) => {
                            return <option key={ind}>{elem}</option>
                        })}
                    </select>
                    <input value={addSelectItemDisabled} onChange={(e) => setAddSelectItemDisabled(e.target.value.trimStart())} placeholder={langAM.nameOptionSelect} size={25}></input>
                    <button disabled={!addSelectItemDisabled} onClick={addItem}>{langAM.addItem}</button>
                </fieldset>
            </div>

        default:
            return <p>{langAM.selectOption}</p>
    }
}
