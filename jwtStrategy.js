const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("./models/user")

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.SECRET
opts.passReqToCallback = true

module.exports = new JwtStrategy(opts, async (req, jwt_payload, done) => {
  const user = await User.findOne({ email: jwt_payload.email }).exec()
  if (user) {
    req.user = user
    return done(null, user)
  }
  return done(null, false)
})
