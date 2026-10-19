import Database from "better-sqlite3"
import bcrypt from "bcrypt"

const db = new Database("app.db")

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
)`)

db.prepare("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)")
    .run("spider donut", bcrypt.hashSync("pw1", 10))

export default db