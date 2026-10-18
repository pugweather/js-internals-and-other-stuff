import express from "express"
import redis from "./redis.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import requireAuth from "./middlewares/requireAuth.js"
import { users } from "./data.js"
import requirePageAuth from "./middlewares/requirePageAuth.js"
import db from "./db.js"

// console.log(db.prepare("SELECT * FROM users").all())

const PORT = 3000

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(express.static("src/public"))
app.use("/app", requirePageAuth, express.static("src/pages"))

app.get("/health", (req, res) => {
    res.json({ ok: true })
})

app.post("/login", async (req, res) => {
    // TODO: real auth with db. Bcrypt?
    const { username, password } = req.body

    const foundUser = db.prepare("SELECT id FROM users WHERE username = ? AND password = ?")
        .get(username.toLowerCase(), password)

    if (!foundUser) return res.status(401).json({error: "Invalid name or password"})

    const sessionId = crypto.randomUUID()
    await redis.set(`sess-${sessionId}`, foundUser.id, {
        EX: 60
    })
    res.cookie("sessionId", sessionId, {
        maxage: 60000,
        httpOnly: true
    })
    res.json({ ok: true })

})

app.get('/me', requireAuth, (req, res) => {
    res.json(req.user)
})

app.delete('/logout', async (req, res) => {
    await redis.del('sess-' + req.cookies.sessionId)
    res.clearCookie("sessionId")
    res.json({ ok: true })
})

app.listen(PORT, function() {
    console.log("server listening on port " + PORT)
})