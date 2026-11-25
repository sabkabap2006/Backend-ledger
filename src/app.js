const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cookieParser())

/**
 * Routes required
 */
const accountRouter = require("./routes/account.routes")
const authRouter = require("./routes/auth.routes")

/**
 * Use Routes
 */
app.use("/api/accounts", accountRouter)
app.use("/api/account", accountRouter)
app.use("/api/auth", authRouter)

module.exports = app
