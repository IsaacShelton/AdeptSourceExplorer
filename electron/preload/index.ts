import { ipcRenderer } from "electron";

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
    return new Promise((resolve) => {
        if (condition.includes(document.readyState)) {
            resolve(true);
        } else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true);
                }
            });
        }
    });
}

const safeDOM = {
    append(parent: HTMLElement, child: HTMLElement) {
        if (!Array.from(parent.children).find((e) => e === child)) {
            return parent.appendChild(child);
        }
    },
    remove(parent: HTMLElement, child: HTMLElement) {
        if (Array.from(parent.children).find((e) => e === child)) {
            return parent.removeChild(child);
        }
    },
};

// https://projects.lukehaas.me/css-loaders/
function useLoading() {
    const styleContent = `
    body {
        background-color: #242424;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    .outer-loader {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }

    .loader,
    .loader:after {
        border-radius: 50%;
        width: 4em;
        height: 4em;
    }

    .loader {
        margin: 0;
        padding: 0;
        font-size: 10px;
        text-indent: -9999em;
        border-top: 0.5em solid rgba(255, 255, 255, 0.2);
        border-right: 0.5em solid rgba(255, 255, 255, 0.2);
        border-bottom: 0.5em solid rgba(255, 255, 255, 0.2);
        border-left: 0.5em solid #ffffff;
        -webkit-animation: load8 1.1s infinite linear;
        animation: load8 1.1s infinite linear;
    }

    @-webkit-keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    } `;
    const oStyle = document.createElement('style');
    const oDiv = document.createElement('div');

    oStyle.id = 'loader';
    oStyle.innerHTML = styleContent;
    oDiv.className = 'outer-loader';
    oDiv.innerHTML = '<div class="loader"></div>'

    return {
        appendLoading() {
            safeDOM.append(document.head, oStyle);
            safeDOM.append(document.body, oDiv);
        },
        removeLoading() {
            safeDOM.remove(document.head, oStyle);
            safeDOM.remove(document.body, oDiv);
        },
    };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
    ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);

(window as any).electronAPI = {
    openFile: () => ipcRenderer.invoke('dialog:openFile')
};
