const mongoose = require("mongoose")
const Schema = mongoose.Schema

const taskSchema = new Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  done_timestamp: Date,
})

module.exports = mongoose.model("Task", taskSchema)
