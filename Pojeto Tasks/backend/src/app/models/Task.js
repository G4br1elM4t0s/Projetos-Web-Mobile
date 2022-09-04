const mongoose = require("../../DataBase");
const bcrypt = require("bcryptjs");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    require: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId, //Jeito de fazer relacionamento entre tabelas em banco de dados não relacionais
    ref: "User",
    require: true,
  },
  completed: {
    type: Boolean,
    require: true,
    default: false, // ou seja será criada automaticamente como não concluida
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
