const Task = require("../models/task")

exports.task_list = async (req, res, next) => {
  const allTasks = await Task.find({ user: req.user }).sort("-timestamp").exec()
  res.json(allTasks)
}

exports.task_create = async (req, res, next) => {
  const { name } = req.body
  const task = new Task({ name, user: req.user._id })
  await task.save()
  res.json(task)
}

exports.task_update = async (req, res, next) => {
  const { taskId } = req.params
  const { name, done } = req.body
  const task = await Task.findById(taskId).exec()
  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: "Not authorized" })
  }
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { name, done },
    { new: true }
  )
  res.json(updatedTask)
}

exports.task_delete = async (req, res, next) => {
  const { taskId } = req.params
  const task = await Task.findById(taskId).exec()
  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: "Not authorized" })
  }
  const deletedTask = await Task.findByIdAndDelete(taskId)
  res.json(deletedTask)
}
