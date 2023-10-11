import React, { useState } from 'react'

export const SwitchElemData = ({ elem, index, index_: index_2='', valueExtraction, setValueElem, reciveArrNumberFun, langAM}) => {
    const [arrNumber, setArrNumber] = useState([]);
    const keyDown = (e) => e.key==='Enter' && e.target.blur();
    switch (elem.type) {

        case 'Ta':
            return <>
                <p>{elem.label && <span>{elem.label}: </span>}</p>
                <textarea value={valueExtraction} onChange={setValueElem} style={{ whiteSpace: 'pre-wrap', height: elem.rows, width: elem.cols, maxWidth: "1490px", minWidth: "200px" }}></textarea>
                <br/>
            </>

        case 'Cb':
            return <>
                <label>{elem.label && <span>{elem.label}: </span>}
                <input type='checkbox' checked={valueExtraction === 'true' ? true : valueExtraction === '' || valueExtraction === 'false' ? false: undefined} onChange={setValueElem} />
                </label>
            </>

        case 'Te':
            return <>
                <label>{elem.label && <span>{elem.label}: </span>}
                <input type='time' value={valueExtraction} onKeyDown={keyDown} onChange={setValueElem} />
                </label>
                <br/>
            </>

        case 'Nr':
            return <>
                {elem.label && <span>{elem.label}: </span>}
                <span>{elem.minNumber} </span>
                <input type='number' list={`list${index}${index_2}`} onKeyDown={keyDown} onFocus={()=>setArrNumber(reciveArrNumberFun())} value={valueExtraction} onChange={setValueElem} min={elem.minNumber} max={elem.maxNumber} step={elem.stepNumber} />
                <datalist id={`list${index}${index_2}`}>
                    {arrNumber.map((e, eindex) => <option key={eindex} value={e}/>)}
                </datalist>
                <span>{elem.maxNumber}</span>
                <p>{langAM.switchElemStep}: {elem.stepNumber} {langAM.switchElemMin}: {elem.minNumber} {langAM.switchElemMax}: {elem.maxNumber}</p>
            </>

        case 'It':
            return <>
                <label>{elem.label && <span>{elem.label}: </span>}
                <input type='input' value={valueExtraction} onChange={setValueElem} onKeyDown={keyDown}/>
                </label>
                <br/>
            </>

        case 'Ro':
            return <>
                <p>{elem.label && <span>{elem.label}: </span>}</p>
                {elem.arr.map((el, ind) => {
                  return <div key={ind}>
                    {/* input type='radio' объединяется через name */}
                    <input type='radio' name={`radio${index}${index_2}`} value={ind} onKeyDown={keyDown} checked={valueExtraction !== undefined ? valueExtraction === `${ind}` : undefined} onChange={setValueElem} />
                    <label>{el}</label>
                  </div>
                })}
            </>

        case 'Re':
            return <>
                <p>{elem.label ? <span>{elem.label}: {valueExtraction}</span> : <span>{valueExtraction}</span>}</p>
                {elem.minRange}
                <input type='range' value={valueExtraction !== undefined ? valueExtraction === '' ? 0 : valueExtraction : undefined} onChange={setValueElem} min={`${elem.minRange}`} max={`${elem.maxRange}`} step={`${elem.stepRange}`} />
                {elem.maxRange}
                <p>{langAM.switchElemStep}: {elem.stepRange} {langAM.switchElemMin}: {elem.minRange} {langAM.switchElemMax}: {elem.maxRange}</p>
            </>

        case 'St':
            return <>
                <p>{elem.label && <span>{elem.label}: </span>}</p>
                <select value={valueExtraction} onKeyDown={keyDown} onChange={setValueElem}>
                    <option>---</option>
                    {elem.arr.map((el, ind) => {
                        return <option key={ind}>{el}</option>
                    })}
                </select>
            </>

        default:
            return <p>{langAM.msgErrorSwitchElem}</p>
    }
}
