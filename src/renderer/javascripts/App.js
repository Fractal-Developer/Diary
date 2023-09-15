import React, { useState, useEffect, useRef } from 'react'
import DataAccaunting from './components/DataAccaunting';
import AccountManagement from './components/AccountManagement';

export default function App({ beginPage }) {
    const [page, setPage] = useState(0);
    let datas = useRef();

    useEffect(() => {
        window.MessagesFromMain.api_data_accaunting((event, data) => {
            datas.current = data;
            setPage(1);
        })
        window.MessagesFromMain.api_account_management((event, data) => {
            datas.current = data;
            setPage(2);
        })
        window.MessagesFromMain.help((event, data) => {
            console.log('help');
            datas.current = data;
            setPage(3);
        })
    }, [])

    switch (page) {
        case 0:
            return <>
                <p>{beginPage.beginPage}</p>
                <div style={{ position: 'fixed', bottom: 0 }}>
                    <p>{beginPage.langAM.electronVersion}: {beginPage.electronVersion}</p>
                    <p>{beginPage.langAM.nodeVersion}: {beginPage.nodeVersion}</p>
                    <p>{beginPage.langAM.chromiumVersion}: {beginPage.chromiumVersion}</p>
                    <p>{beginPage.langAM.workDirectory}: {beginPage.workDirectory}</p>
                </div>
            </>
        case 1:
            return <DataAccaunting data={datas.current} />
            break;
        case 2:
            return <AccountManagement data={datas.current} />
            break;
        case 3:
            return <p>{datas.current}</p>
            break;
        default:
            return <p>Critical error. The page variable has an invalid value: {page}</p>
            break;
    }
}