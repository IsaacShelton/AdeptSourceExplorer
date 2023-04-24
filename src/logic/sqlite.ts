import { readFile, writeFile, existsSync, mkdirSync } from 'fs';
import initSqlJs, { Database } from '@/sql.js/sql-wasm.js';
import path from 'path';
import { shellEnv } from 'shell-env';

// Can't save local file once bundled as asar
// https://stackoverflow.com/questions/60881343/electron-problem-creating-file-error-erofs-read-only-file-system
async function getAppDataPath() {
    let env = await shellEnv();

    switch (process.platform) {
        case "darwin": {
            return path.join(env.HOME ?? "", "Library", "Application Support", "AdeptSourceExplorer");
        }
        case "win32": {
            return path.join(env.APPDATA ?? "", "AdeptSourceExplorer");
        }
        case "linux": {
            return path.join(env.HOME ?? "", "AdeptSourceExplorer");
        }
        default: {
            console.log("Unsupported platform!");
            process.exit(1);
        }
    }
}

const DATABASE_FILENAME: Promise<string> = new Promise((resolve, reject) => {
    getAppDataPath().then(appDataFolder => {
        // Create appDataDir if not exist
        if (!existsSync(appDataFolder)) {
            mkdirSync(appDataFolder);
        }

        resolve(path.join(appDataFolder, 'database.db'));
    });
});

const SQL_JS = initSqlJs({ locateFile: (file: string) => `https://sql.js.org/dist/${file}` });

let database: Promise<Database> = new Promise(function (resolve, reject) {
    getAppDataPath().then(appDataFolder => {
        SQL_JS.then((SQL) => {
            DATABASE_FILENAME.then((filename: string) => {
                readFile(filename, null, function (err, data) {
                    resolve(err ? new SQL.Database() : new SQL.Database(data));
                });
            });
        });
    });
});

async function query(
    format: string,
    bindings: initSqlJs.BindParams | undefined = undefined
): Promise<any[]> {
    const stmt = (await database).prepare(format);
    stmt.bind(bindings);

    let rows = [];

    while (stmt.step()) {
        rows.push(stmt.getAsObject());
    }

    return rows;
}

async function run(
    format: string,
    bindings: initSqlJs.BindParams | undefined = undefined
): Promise<void> {
    (await database).prepare(format).run(bindings);
}

async function insert(
    format: string,
    bindings: initSqlJs.BindParams | undefined = undefined
): Promise<number> {
    (await database).prepare(format).run(bindings);
    return await getInsertedID();
}

async function getInsertedID(): Promise<number> {
    let last_row_info: any[] = await query('SELECT LAST_INSERT_ROWID() AS ProjectID');
    return last_row_info[0].ProjectID;
}

async function save(): Promise<void> {
    return new Promise(function (resolve, reject) {
        database.then((db) => {
            DATABASE_FILENAME.then((filename: string) => {
                writeFile(filename, db.export(), 'binary', function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
    });
}

async function tables(): Promise<string[]> {
    return (
        await query(`
        SELECT name
            FROM sqlite_schema
            WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `)
    ).map((row: any) => row.name);
}

export default { query, run, save, tables, insert, getInsertedID };
