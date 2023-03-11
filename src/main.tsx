import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './samples/node-api'
import './index.scss'
import sqlite from './sqlite.js';

import { readFile } from 'fs';
import { invokeInsight } from './insight/insight';

let filename = "/Users/isaac/Projects/Adept/build/macOS-Debug/import/2.8/basics.adept";

readFile(filename, 'utf8', function (err, code) {
    if (err) throw err;

    invokeInsight({
        "query": "ast",
        "infrastructure": "/Users/isaac/Projects/Adept/build/macOS-Debug/",
        "filename": filename,
        "code": code,
        "features": ['include-arg-info', 'include-calls']
    }).then(function (result: any) {
        console.log(result);
    });
});

sqlite.run("DROP TABLE IF EXISTS hello");
sqlite.run("CREATE TABLE IF NOT EXISTS hello (a int, b char)");

sqlite.run(`
    CREATE TABLE IF NOT EXISTS functions (
        FunctionID AUTO_INCREMENT INT,
        FunctionName VARCHAR(1024),
        FunctionDefinition VARCHAR(4096),
        FunctionSourceObject VARCHAR(4096),
        FunctionSourceIndex INT,
        FunctionSourceStride Int,
        FunctionEndIndex INT,
        FunctionEndStride INT
    )
`);

sqlite.run("INSERT INTO hello VALUES (?1, ?2)", { "?1": 2, "?2": 'hello' });

sqlite.query("SELECT * FROM hello WHERE a=?1 AND b=?2", { "?1": 1, "?2": 'world' }).then(function (results) {
    console.log("Got " + JSON.stringify(results));
});

sqlite.query("SELECT * FROM hello").then(function (results) {
    console.log("Got " + JSON.stringify(results));
});

sqlite.tables().then((tables) => console.log(tables));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
