import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './samples/node-api';
import './index.scss';
import sqlite from './sqlite.js';

import { promises } from 'fs';
import { invokeInsight } from './insight/insight';
const readFile = promises.readFile;

sqlite.run("DROP TABLE IF EXISTS Project");
sqlite.run("DROP TABLE IF EXISTS Function");
sqlite.run("DROP TABLE IF EXISTS Composite");
sqlite.run("DROP TABLE IF EXISTS Call");

async function createProject(rootFilename: string): Promise<number> {
    let filename = rootFilename;

    let code = await readFile(filename, 'utf8');
    let infrastructure = "/Users/isaac/Projects/Adept/build/macOS-Debug/";

    let result: any = await invokeInsight({
        "query": "ast",
        "infrastructure": infrastructure,
        "filename": filename,
        "code": code,
        "features": ['include-arg-info', 'include-calls']
    });

    await sqlite.run(`
            CREATE TABLE IF NOT EXISTS Project (
                ProjectID Integer PRIMARY KEY AUTOINCREMENT,
                ProjectName VARCHAR(1024),
                ProjectInfrastructure VARCHAR(2048),
                ProjectRootFilename VARCHAR(2048),
                ProjectCreated INTEGER,
                ProjectLastOpened INTEGER,
                ProjectUpdated INTEGER
            )
        `);

    await sqlite.run(`
            CREATE TABLE IF NOT EXISTS Function (
                FunctionID INTEGER PRIMARY KEY AUTOINCREMENT,
                FunctionName VARCHAR(1024),
                FunctionDefinition VARCHAR(4096),
                FunctionSourceObject VARCHAR(4096),
                FunctionSourceIndex INT,
                FunctionSourceStride INT,
                FunctionEndIndex INT,
                FunctionEndStride INT,
                ProjectID INT,

                CONSTRAINT fk_ProjectID
                    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
                    ON DELETE CASCADE
            )
        `);

    await sqlite.run(`
            CREATE TABLE IF NOT EXISTS Composite (
                CompositeID INTEGER PRIMARY KEY AUTOINCREMENT,
                CompositeName VARCHAR(1024),
                CompositeDefinition VARCHAR(4096),
                CompositeSourceObject VARCHAR(4096),
                CompositeSourceIndex INT,
                CompositeSourceStride Int,
                ProjectID INT,

                CONSTRAINT fk_ProjectID
                    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
                    ON DELETE CASCADE
            )
        `);

    await sqlite.run(`
            CREATE TABLE IF NOT EXISTS Call (
                CallCallee VARCHAR(1024),
                CallAmount INT,
                CallCallerFunctionID INT,

                CONSTRAINT fk_FunctionID
                    FOREIGN KEY (CallCallerFunctionID) REFERENCES Function(FunctionID)
                    ON DELETE CASCADE
            )
        `);

    function now() {
        return new Date().getTime() / 1000;
    }

    let time = now();

    let projectID = await sqlite.insert(`
            INSERT INTO Project VALUES (
                NULL,
                :ProjectName,
                :ProjectInfrastructure,
                :ProjectRootFilename,
                :ProjectCreated,
                :ProjectLastOpened,
                :ProjectLastUpdated
            )
        `, {
        ":ProjectName": filename,
        ":ProjectInfrastructure": filename,
        ":ProjectRootFilename": filename,
        ":ProjectCreated": time,
        ":ProjectLastOpened": 0,
        ":ProjectLastUpdated": time,
    });

    let funcs: any[] = result?.ast?.functions;
    let composites: any[] = result?.ast?.composites;
    let calls: any[] = result?.calls;
    let funcIndices: number[] = [];

    if (funcs) {
        for (let func of funcs) {
            funcIndices.push(await sqlite.insert(`INSERT INTO Function VALUES (
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
                ":FunctionSourceObject": func.source.object,
                ":FunctionSourceIndex": func.source.index,
                ":FunctionSourceStride": func.source.stride,
                ":FunctionEndIndex": func.end.index,
                ":FunctionEndStride": func.end.stride,
                ":ProjectID": projectID,
            }));
        }
    }

    if (composites) {
        for (let composite of composites) {
            await sqlite.run(`INSERT INTO Composite VALUES (
                NULL,
                :CompositeName,
                :CompositeDefinition,
                :CompositeSourceObject,
                :CompositeSourceIndex,
                :CompositeSourceStride,
                :ProjectID
            )`, {

                ":CompositeName": composite.name,
                ":CompositeDefinition": composite.definition,
                ":CompositeSourceObject": composite.source.object,
                ":CompositeSourceIndex": composite.source.index,
                ":CompositeSourceStride": composite.source.stride,
                ":ProjectID": projectID,
            });
        }
    }

    if (calls) {
        for (let funcIndex = 0; funcIndex < calls.length; funcIndex++) {
            let callsTo = calls[funcIndex];

            for (let call of callsTo) {
                await sqlite.run(`INSERT INTO Call VALUES (
                    :CallCallee,
                    :CallAmount,
                    :CallCallerFunctionID
                )`, {
                    ":CallCallee": call.name,
                    ":CallAmount": call.count,
                    ":CallCallerFunctionID": funcIndices[funcIndex],
                });
            }
        }
    }

    console.log("Functions list: ", await sqlite.query("SELECT * FROM Function"));
    console.log("Functions query test: ", await sqlite.query("SELECT FunctionDefinition FROM Function WHERE FunctionDefinition LIKE '%?%' ORDER BY FunctionDefinition ASC"));
    console.log("Composites list: ", await sqlite.query("SELECT * FROM Composite"));
    console.log("Calls list: ", await sqlite.query("SELECT CallCallee, sum(CallAmount) FROM Call GROUP BY CallCallee ORDER BY sum(CallAmount) DESC"));
    console.log(result);

    return projectID;
}

createProject("/Users/isaac/AdeptProjects/GenericCardGame/main.adept").then(() => { });
// createProject("/Users/isaac/Projects/Adept/build/macOS-Debug/import/2.8/basics.adept").then(() => { });
// createProject("/Users/isaac/AdeptProjects/Box2D/box2d/box2d.adept").then(() => { });
// createProject("/Users/isaac/AdeptProjects/MiniBox/main.adept").then(() => { });

// sqlite.tables().then((tables) => console.log(tables));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
