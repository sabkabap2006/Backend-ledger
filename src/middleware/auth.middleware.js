const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

/**
 * Middleware for authentication
 */
async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided" })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId || decodedToken.id

        if (!userId) {
            return res.status(401).json({ message: "Invalid token payload" })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(401).json({ message: "Unauthorized, user not found" })
        }

        req.user = user
        next()
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired token" })
        }
        console.error("Auth middleware error:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function authSystemMiddleware(req, res, next) {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided" })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId || decodedToken.id

        if (!userId) {
            return res.status(401).json({ message: "Invalid token payload" })
        }

        const user = await userModel.findById(userId)
        if (!user.systemUser) {
            return res.status(401).json({ message: "Unauthorized, user not found" })
        }

        req.user = user
        next()
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired token" })
        }
        console.error("Auth middleware error:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = authMiddleware
module.exports.authMiddleware = authMiddleware
module.exports.authSystemMiddleware = authSystemMiddleware
