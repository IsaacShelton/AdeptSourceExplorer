
import { readFile, writeFile } from 'fs';
import initSqlJs, { Database } from 'sql.js';

const DATABASE_FILENAME = './database.db';
const SQL = await initSqlJs({ locateFile: (file: any) => `https://sql.js.org/dist/${file}` });

let database: Promise<Database> = new Promise(function (resolve, reject) {
    readFile("./database.db", null, function (err, data) {
        resolve(err ? new SQL.Database() : new SQL.Database(data));
    });
});

async function query(format: string, bindings: initSqlJs.BindParams | undefined = undefined): Promise<object[]> {
    const stmt = (await database).prepare(format);
    stmt.bind(bindings);

    let rows = [];

    while (stmt.step()) {
        rows.push(stmt.getAsObject());
    }

    return rows;
}

async function run(format: string, bindings: initSqlJs.BindParams | undefined = undefined): Promise<void> {
    (await database).prepare(format).run(bindings);
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
    return (await query(`
        SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `)).map((row: any) => row.name);
}

export default { query, run, save, tables };
