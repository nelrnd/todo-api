const mongoose = require("mongoose")
const Schema = mongoose.Schema

const taskSchema = new Schema({
  name: { type: String, required: true },
  done: { type: Boolean, required: true, default: false },
  timestamp: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
})

module.exports = mongoose.model("Task", taskSchema)
