const express = require("express")
const Router = express.Router()

const taskController = require("../controllers/task")
const authController = require("../controllers/auth")

Router.post("/task", authController.protected, taskController.task_create)

Router.get("/", authController.protected, taskController.task_list)

Router.put("/:taskId", authController.protected, taskController.task_update)

Router.delete("/:taskId", authController.protected, taskController.task_delete)

module.exports = Router
