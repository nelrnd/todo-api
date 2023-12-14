const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("./models/user")
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.SECRET

module.exports = new JwtStrategy(opts, async (jwt_payload, done) => {
  const user = await User.findOne({ email: jwt_payload.email }).exec()
  if (user) {
    return done(null, true)
  }
  return done(null, false)
})
