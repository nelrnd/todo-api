const express = require("express")
const Router = express.Router()

const taskController = require("../controllers/task")

Router.post("/", taskController.task_create)

Router.get("/", taskController.task_list)

Router.get("/:taskId", taskController.task_detail)

Router.put("/:taskId", taskController.task_update)

Router.delete("/:taskId", taskController.task_delete)

module.exports = Router
