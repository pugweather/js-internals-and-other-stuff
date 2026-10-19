
// import redis from "../redis.js"
import db from "../db.js"
import jwt from "jsonwebtoken"

export default async function requireAuth(req, res, next) {
    const token = req.cookies.token

    try {
        const { id: userId } = jwt.verify(token, process.env.JWT_SECRET)

        const foundUser = db.prepare("SELECT id, username FROM users WHERE id = ?")
            .get(Number(userId))
        if (!foundUser) return res.status(401).json({ error: "User for session doesn't exist" })

        req.user = {
            id: foundUser.id,
            username: foundUser.username,
        }
        next()
    } catch(err) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }

    // const sessionId = req.cookies.sessionId
    // const userId = await redis.get(`sess-${sessionId}`)

    // if (!userId) return res.status(401).json({ error: "No Session" })
    
}