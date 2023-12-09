const Task = require("../models/task")

exports.task_list = async (req, res, next) => {
  const allTasks = await Task.find().sort("-timestamp").exec()
  res.json(allTasks)
}

exports.task_detail = async (req, res, next) => {
  const { taskId } = req.params
  const task = await Task.findById(taskId).exec()
  res.json(task)
}

exports.task_create = async (req, res, next) => {
  const { name } = req.body
  const task = new Task({ name })
  await task.save()
  res.json(task)
}

exports.task_update = async (req, res, next) => {
  const { taskId } = req.params
  const { name, done_timestamp } = req.body
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { name, done_timestamp },
    { new: true }
  )
  res.json(updatedTask)
}

exports.task_delete = async (req, res, next) => {
  const { taskId } = req.params
  const deletedTask = await Task.findByIdAndDelete(taskId)
  res.json(deletedTask)
}
