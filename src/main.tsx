import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './samples/node-api';
import './index.scss';
import sqlite from './logic/sqlite.js';

sqlite.run('DROP TABLE IF EXISTS Project');
sqlite.run('DROP TABLE IF EXISTS Function');
sqlite.run('DROP TABLE IF EXISTS Composite');
sqlite.run('DROP TABLE IF EXISTS Call');
sqlite.run(`
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

sqlite.run(`
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

sqlite.run(`
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

sqlite.run(`
    CREATE TABLE IF NOT EXISTS Call (
        CallCallee VARCHAR(1024),
        CallAmount INT,
        CallCallerFunctionID INT,

        CONSTRAINT fk_FunctionID
            FOREIGN KEY (CallCallerFunctionID) REFERENCES Function(FunctionID)
            ON DELETE CASCADE
    )
`);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');
