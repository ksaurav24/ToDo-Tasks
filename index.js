const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const date = require("date-and-time");
const port = process.env.PORT || 3030;

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
let Tasks = [];

app.get("/", (req, res) => {
  res.redirect("/tasks");
});
app.get("/tasks", (req, res) => {
  const fullURL = `${req.protocol}://${req.get("host")}`;
  res.render("tasks", { tasks: Tasks, fullURL: fullURL });
});

app.post("/tasks", (req, res) => {
  const task = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    status: "pending",
    dueDate: req.body.dueDate,
  };
  Tasks.push(task);
  res.redirect("/");
});

app.get("/tasks/:id", (req, res) => {
  try {
    const task = Tasks.find((task) => task.id === req.params.id);
    if (!task) {
      throw new Error("Task not found");
    }
    res.render("task", { task: task });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

app.delete("/tasks/:id", (req, res) => {
  Tasks = Tasks.filter((task) => task.id !== req.params.id);
  res.redirect("/");
});

app.put("/tasks/:id", (req, res) => {
  try {
    const task = Tasks.find((task) => task.id === req.params.id);
    if (!task) {
      throw new Error("Invalid task id");
    }
    task.title = req.body.title;
    task.description = req.body.description;
    task.dueDate = req.body.dueDate;
    task.status = req.body.status;
    res.redirect("/");
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
