import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './samples/node-api'
import './index.scss'

import { readFileSync } from 'fs';
import { invokeInsight } from './insight/insight';

let filename = "/Users/isaac/Projects/Adept/build/macOS-Debug/import/2.8/basics.adept";

console.log(process.versions);

invokeInsight({
    "query": "ast",
    "infrastructure": "/Users/isaac/Projects/Adept/build/macOS-Debug/",
    "filename": filename,
    "code": readFileSync(filename, "utf8"),
    "features": ['include-arg-info', 'include-calls']
}).then(function (result: any) {
    console.log(result);
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
