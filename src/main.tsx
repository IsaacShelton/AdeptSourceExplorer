import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import fixPath from 'fix-path';

fixPath();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');
