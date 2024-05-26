const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const port = process.env.PORT || 3030;

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
let { tasks } = require("./data.js");

app.get("/", (req, res) => {
  res.redirect("/tasks");
});

app.get("/tasks", (req, res) => {
  const fullURL = `${req.protocol}://${req.get("host")}`;
  res.render("tasks", { tasks: tasks, fullURL: fullURL });
});

app.post("/tasks", (req, res) => {
  const task = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    status: "pending",
    dueDate: req.body.dueDate,
  };
  tasks.push(task);
  res.redirect("/");
});

app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((task) => task.id === req.params.id);
  res.render("task", { task: task });
});

app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter((task) => task.id !== req.params.id);
  res.redirect("/");
});

app.put("/tasks/:id", (req, res) => {
  const task = tasks.find((task) => task.id === req.params.id);
  task.title = req.body.title;
  task.description = req.body.description;
  task.dueDate = req.body.dueDate;
  task.status = req.body.status;
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
