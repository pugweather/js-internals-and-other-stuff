// import redis from "../redis.js"
import db from "../db.js"
import jwt from "jsonwebtoken"

export default async function requirePageAuth(req, res, next) {
    // const sessionId = req.cookies.sessionId
    // const userId = await redis.get(`sess-${sessionId}`)
    try {
        const token = req.cookies.token
        const { id: userId } = jwt.verify(token, process.env.JWT_SECRET)

        const foundUser = db.prepare("SELECT id FROM users WHERE id = ?")
            .get(Number(userId))

        if (!foundUser) return res.redirect("/index.html")
        
        next()
    } catch (err) {
        return res.redirect("/index.html")
    }


    
}