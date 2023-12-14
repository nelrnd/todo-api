require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const jwtStrategy = require("../jwtStrategy")
const User = require("../models/user")

passport.use(jwtStrategy)

exports.register = async (req, res, next) => {
  const { email, password } = req.body
  const hash = await bcrypt.hash(password, 10)
  const user = new User({ email, password: hash })
  await user.save()
  next()
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email }).exec()
  if (user) {
    const match = await bcrypt.compare(password, user.password)
    if (match) {
      const SECRET = process.env.SECRET
      const token = jwt.sign({ email }, SECRET)
      return res.status(200).json({ token })
    }
  }
  return res.status(401).json({ message: "Auth failed" })
}

exports.protected = passport.authenticate("jwt", { session: false })
