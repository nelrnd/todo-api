require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const compression = require("compression")
const helmet = require("helmet")

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(compression())
app.use(helmet())

// Set up rate limiter
const RateLimit = require("express-rate-limit")
const limiter = RateLimit({ windowsMs: 1 * 60 * 1000, max: 100 })
app.use(limiter)

// Connect to database
const mongoDB = process.env.MONGODB_URI
const main = async () => mongoose.connect(mongoDB)
main().catch((err) => console.error(err))

const apiRouter = express.Router()
const authRouter = require("./routes/auth")
const taskRouter = require("./routes/task")
app.use("/api", apiRouter)
apiRouter.use("/", authRouter)
apiRouter.use("/tasks", taskRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
