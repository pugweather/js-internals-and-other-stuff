
import redis from "../redis.js"
import { users } from "../data.js"

export default async function requireAuth(req, res, next) {
    const sessionId = req.cookies.sessionId
    const userId = await redis.get(`sess-${sessionId}`)

    if (!userId) return res.status(401).json({ error: "No Session" })
    const user = users.find(user => user.id === Number(userId))
    if (!user) return res.status(401).json({ error: "User for session doesn't exist" })

    req.user = {
        id: user.id,
        username: user.username,
    }
        
    next()
}