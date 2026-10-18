import redis from "../redis.js"
import { users } from "../data.js"
import db from "../db.js"

export default async function requirePageAuth(req, res, next) {
    const sessionId = req.cookies.sessionId
    const userId = await redis.get(`sess-${sessionId}`)
    if (!userId) return res.redirect("/index.html")

    const foundUser = db.prepare("SELECT id FROM users WHERE id = ?")
        .get(Number(userId))
    if (!foundUser) return res.redirect("/index.html")
    
    next()
}