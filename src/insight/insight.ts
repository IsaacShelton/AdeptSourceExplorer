interface ScheduledInsight {
    resolve: Function;
    reject: Function;
    query_json: object;
}

// @ts-ignore
import insight_server from './insight_server.js';

let is_wasm_initialized = false;
let scheduled: ScheduledInsight[] = [];

insight_server.Module['onRuntimeInitialized'] = function () {
    if (!insight_server.Module['noFSInit'] && !insight_server.FS.init.initialized)
        insight_server.FS.init();
    insight_server.TTY.init();
    is_wasm_initialized = true;

    for (let promise of scheduled) {
        invokeInsight(promise.query_json).then((result) => {
            promise.resolve(result);
        });
    }
};

export function invokeInsight(query_json: object): Promise<object> {
    return new Promise(function (resolve, reject) {
        if (is_wasm_initialized) {
            let query_json_string = JSON.stringify(query_json);

            let bytes = insight_server.lengthBytesUTF8(query_json_string);
            let cstring = insight_server._malloc(bytes + 1);
            insight_server.stringToUTF8(query_json_string, cstring, bytes + 1);
            let result_json_cstring = insight_server.Module._server_main(cstring);
            let result_json = insight_server.UTF8ToString(result_json_cstring);
            insight_server._free(cstring);
            insight_server._free(result_json_cstring);
            insight_server.checkUnflushedContent();

            resolve(JSON.parse(result_json));
        } else {
            scheduled.push({ resolve, reject, query_json });
        }
    });
}

export function isWasmInitialized() {
    return is_wasm_initialized;
}
