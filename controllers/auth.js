require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const jwtStrategy = require("../jwtStrategy")
const { body, validationResult } = require("express-validator")
const User = require("../models/user")

passport.use(jwtStrategy)

exports.register = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Email must be between 5 and 200 characters")
    .isEmail()
    .withMessage("Invalid email format (example@email.com)")
    .custom(async (value) => {
      const exists = await User.exists({ email: value })
      if (exists) {
        throw new Error("Email is already used")
      }
    }),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((value) => {
      let digitCount = 0
      let letterCount = 0
      value.split("").forEach((char) => {
        if (/[0-9]/.test(char)) {
          digitCount++
        } else if (/[a-zA-Z]/.test(char)) {
          letterCount++
        }
      })
      const isPasswordValid = digitCount >= 2 && letterCount >= 2
      if (!isPasswordValid) {
        throw new Error("Password must contain at least 2 letters and 2 digits")
      } else {
        return true
      }
    }),
  async (req, res, next) => {
    const errors = validationResult(req)
    const { email, password } = req.body
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), user: { email, password } })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hash })
    await user.save()
    next()
  },
]

exports.login = [
  body("email").exists().withMessage("Email is required"),
  body("password").exists().withMessage("Password is required"),
  async (req, res, next) => {
    const errors = validationResult(req)
    const { email, password } = req.body
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), user: { email, password } })
    }
    const user = await User.findOne({ email: email }).exec()
    if (user) {
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        const SECRET = process.env.SECRET
        const token = jwt.sign({ email }, SECRET)
        return res.status(200).json({ token })
      }
    }
    return res.status(401).json({
      errors: [{ path: "password", msg: "Invalid email or password" }],
    })
  },
]

exports.protected = passport.authenticate("jwt", { session: false })
