require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Connect to database
const mongoDB = process.env.MONGODB_URI
const main = async () => mongoose.connect(mongoDB)
main().catch((err) => console.error(err))

app.get("/", (req, res) => res.send("Hello World!"))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
