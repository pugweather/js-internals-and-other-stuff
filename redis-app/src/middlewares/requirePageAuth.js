import redis from "../redis.js"
import { users } from "../data.js"

export default async function requirePageAuth(req, res, next) {
    const sessionId = req.cookies.sessionId
    const userId = await redis.get(`sess-${sessionId}`)
    if (!userId) return res.redirect("/index.html")
    const user = users.find(user => user.id === Number(userId))
    if (!user) return res.redirect("/index.html")
    
    next()
}