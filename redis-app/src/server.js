import express from "express"
import redis from "./redis.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import requireAuth from "./middlewares/requireAuth.js"
import requirePageAuth from "./middlewares/requirePageAuth.js"
import db from "./db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

process.loadEnvFile()

const stats = { requests: 0, perPath: {} }

const app = express()

app.use((req, res, next) => {
    stats.requests++
    stats.perPath[req.path] = (stats.perPath[req.path] || 0) + 1
    next()
})
app.use(express.json())
app.use(cookieParser())
// app.use(cors({ origin: "http://localhost:3000", credentials: true })) specify origin 
app.use(cors())
app.use(express.static("src/public"))
app.use("/app", requirePageAuth, express.static("src/pages"))

app.get("/health", (req, res) => {
    res.json({ data: stats, port: process.env.PORT, uptime: process.uptime()})
})

app.post("/login", async (req, res) => {
    // TODO: real auth with db. Bcrypt?
    const { username, password } = req.body

    const foundUser = db.prepare("SELECT id, password FROM users WHERE username = ?")
        .get(username.toLowerCase())

    if (!foundUser) return res.status(401).json({error: "Invalid username or password"})

    const ok = await bcrypt.compare(password, foundUser.password)
    if (!ok) {
        return res.status(401).json({error: "Invalid username or password"})
    }

    const token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET, { expiresIn: 60 })
    console.log(token)
    // const sessionId = crypto.randomUUID()
    // await redis.set(`sess-${sessionId}`, foundUser.id, {
    //     EX: 60
    // })

    const refreshToken = crypto.randomUUID()
    await redis.set(`refresh-${refreshToken}`, foundUser.id, {
        EX: 180
    })

    res.cookie("token", token, {
        maxAge: 60000, // 1 min
        httpOnly: true
    })
    res.cookie("refreshToken", refreshToken, {
        maxAge: 180000, // 3 mins
        httpOnly: true
    })
    res.json({ ok: true })

})

app.get('/me', requireAuth, (req, res) => {
    res.json(req.user)
})

app.get('/refresh', async (req, res) => {
    const userId = await redis.get(`refresh-${req.cookies.refreshToken}`)
    console.log(userId)
    if (!userId) {
        return res.status(401).json({ error: "No valid refresh token"})
    }
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: 60 })

    res.cookie("token", token, {
        maxAge: 60000,
        httpOnly: true
    })
    res.json({ ok: true })
})

app.delete('/logout', async (req, res) => {
    // await redis.del('sess-' + req.cookies.sessionId)
    res.clearCookie("token")
    res.json({ ok: true })
})

app.listen(process.env.PORT, function() {
    console.log("server listening on port " + process.env.PORT)
})