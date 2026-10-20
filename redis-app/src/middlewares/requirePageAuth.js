import redis from "../redis.js"
import db from "../db.js"
import jwt from "jsonwebtoken"

export default async function requirePageAuth(req, res, next) {
    // const sessionId = req.cookies.sessionId
    // const userId = await redis.get(`sess-${sessionId}`)

    let userId
    let token = req.cookies.token
    const refreshToken = req.cookies.refreshToken
    try {
        userId = jwt.verify(token, process.env.JWT_SECRET).id
    } catch(err) {
        userId = await redis.get(`refresh-${refreshToken}`)
        if (userId) {
            const newToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: 60 })
            res.cookie("token", newToken, {
                maxAge: 60000,
                httpOnly: true
            })
        }
    }

    if (!userId) return res.redirect("/index.html")
    const foundUser = db.prepare("SELECT id FROM users WHERE id = ?")
        .get(Number(userId))
    if (!foundUser) return res.redirect("/index.html")
    
    next()
}