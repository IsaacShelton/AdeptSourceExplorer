import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './samples/node-api'
import './index.scss'
import sqlite from './sqlite.js';

import { promises } from 'fs';
import { invokeInsight } from './insight/insight';
const readFile = promises.readFile;

sqlite.run("DROP TABLE IF EXISTS Project");
sqlite.run("DROP TABLE IF EXISTS Function");

async function createProject(rootFilename: string): Promise<number> {
    let filename = rootFilename;

    let code = await readFile(filename, 'utf8');

    let result: any = await invokeInsight({
        "query": "ast",
        "infrastructure": "/Users/isaac/Projects/Adept/build/macOS-Debug/",
        "filename": filename,
        "code": code,
        "features": ['include-arg-info', 'include-calls']
    });

    await sqlite.run(`
            CREATE TABLE IF NOT EXISTS Project (
                ProjectID Integer PRIMARY KEY AUTOINCREMENT,
                ProjectName VARCHAR(1024)
            )
        `);

    await sqlite.run(`
            CREATE TABLE IF NOT EXISTS Function (
                FunctionID INTEGER PRIMARY KEY AUTOINCREMENT,
                FunctionName VARCHAR(1024),
                FunctionDefinition VARCHAR(4096),
                FunctionSourceObject VARCHAR(4096),
                FunctionSourceIndex INT,
                FunctionSourceStride Int,
                FunctionEndIndex INT,
                FunctionEndStride INT,
                ProjectID INT,

                CONSTRAINT fk_FunctionID
                    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
                    ON DELETE CASCADE
            )
        `);

    let projectID = await sqlite.insert(`
            INSERT INTO Project VALUES (NULL, :ProjectName)
        `, {
        ":ProjectName": filename
    });

    let funcs: any[] = result?.ast?.functions;

    if (funcs) {
        for (let func of funcs) {
            await sqlite.run(`INSERT INTO Function VALUES (
                    NULL,
                    :FunctionName,
                    :FunctionDefinition,
                    :FunctionSourceObject,
                    :FunctionSourceIndex,
                    :FunctionSourceStride,
                    :FunctionEndIndex,
                    :FunctionEndStride,
                    :ProjectID
                )`, {
                ":FunctionName": func.name,
                ":FunctionDefinition": func.definition,
                ":FunctionSourceObject": null,
                ":FunctionSourceIndex": null,
                ":FunctionSourceStride": null,
                ":FunctionEndIndex": null,
                ":FunctionEndStride": null,
                ":ProjectID": projectID,
            });
            console.log(func);
        }

        console.log("success");
        console.log(await sqlite.tables());
        console.log(result);
    }

    console.log("Functions list: ", await sqlite.query("SELECT * FROM Function"));
    console.log("Functions query test: ", await sqlite.query("SELECT FunctionDefinition FROM Function WHERE FunctionDefinition LIKE '%?%' ORDER BY FunctionDefinition ASC"));

    return projectID;
}

createProject("/Users/isaac/AdeptProjects/GenericCardGame/main.adept").then(() => { });

// createProject("/Users/isaac/Projects/Adept/build/macOS-Debug/import/2.8/basics.adept").then(() => {

// });

sqlite.run("DROP TABLE IF EXISTS hello");
sqlite.run("DROP TABLE IF EXISTS functions");
sqlite.run("CREATE TABLE IF NOT EXISTS hello (a int, b char)");

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
