import { readFile, writeFile } from 'fs';
import initSqlJs, { Database } from 'sql.js';

const DATABASE_FILENAME = './database.db';
const SQL_JS = initSqlJs({ locateFile: (file: string) => `https://sql.js.org/dist/${file}` });

let database: Promise<Database> = new Promise(function (resolve, reject) {
    SQL_JS.then((SQL) => {
        readFile('./database.db', null, function (err, data) {
            resolve(err ? new SQL.Database() : new SQL.Database(data));
        });
    });
});

async function query(
    format: string,
    bindings: initSqlJs.BindParams | undefined = undefined
): Promise<object[]> {
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
            writeFile(DATABASE_FILENAME, db.export(), 'binary', function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

async function tables(): Promise<string[]> {
    return (
        await query(`
        SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `)
    ).map((row: any) => row.name);
}

export default { query, run, save, tables, insert, getInsertedID };
