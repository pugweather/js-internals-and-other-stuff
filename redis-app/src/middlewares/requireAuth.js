
import redis from "../redis.js"
import { users } from "../data.js"
import db from "../db.js"

export default async function requireAuth(req, res, next) {
    const sessionId = req.cookies.sessionId
    const userId = await redis.get(`sess-${sessionId}`)

    if (!userId) return res.status(401).json({ error: "No Session" })

    const foundUser = db.prepare("SELECT id, username FROM users WHERE id = ?")
        .get(Number(userId))
    if (!foundUser) return res.status(401).json({ error: "User for session doesn't exist" })

    req.user = {
        id: foundUser.id,
        username: foundUser.username,
    }
        
    next()
}