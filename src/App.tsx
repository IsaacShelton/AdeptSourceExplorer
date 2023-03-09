
import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

import { message } from "@tauri-apps/api/dialog";
import SQLite from 'tauri-plugin-sqlite-api'

await (async function testingSqliteIntegration() {
  await message("Hello");

  /** The path will be 'src-tauri/database.db' */
  const db = await SQLite.open('./database.db')

  /** execute SQL */
  await db.execute(`
      CREATE TABLE users (name TEXT, age INTEGER);
      INSERT INTO users VALUES ('Alice', 42);
      INSERT INTO users VALUES ('Bob', 69);
  `)

  /** execute SQL with params */
  await db.execute('INSERT INTO users VALUES (?1, ?2)', ['Jack', 18])

  /** batch execution SQL with params */
  await db.execute('INSERT INTO users VALUES (?1, ?2)', [
    ['Allen', 20],
    ['Barry', 16],
    ['Cara', 28],
  ])

  /** select count */
  const rows1 = await db.select<Array<{ count: number }>>('SELECT COUNT(*) as count FROM users')

  await message(JSON.stringify(rows1));

  /** select with param */
  const rows2 = await db.select<Array<{ name: string }>>('SELECT name FROM users WHERE age > ?', [20])

  await message(JSON.stringify(rows2));

  /** select with params, you can use ? or $1 .. $n */
  const rows3 = await db.select<Array<any>>('SELECT * FROM users LIMIT $1 OFFSET $2', [10, 0])

  await message(JSON.stringify(rows3));

  /** close sqlite database */
  const isClosed = await db.close()
})();

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
