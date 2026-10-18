import Database from "better-sqlite3"

const db = new Database("app.db")

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
)`)

db.prepare("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)")
    .run("spider donut", "password-test-1")

export default db