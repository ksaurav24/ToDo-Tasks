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
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}
let tasks = [];
localStorage.setItem("tasks", JSON.stringify(tasks));

app.get("/", (req, res) => {
  res.redirect("/tasks");
});

app.get("/tasks", (req, res) => {
  const fullURL = `${req.protocol}://${req.get("host")}`;
  let renderTasks = localStorage.getItem("tasks");
  let Tasks = JSON.parse(renderTasks);
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
  let renderTasks = localStorage.getItem("tasks");
  const Tasks = JSON.parse(renderTasks);
  Tasks.push(task);
  localStorage.removeItem("tasks");
  localStorage.setItem("tasks", JSON.stringify(Tasks));
  res.redirect("/");
});

app.get("/tasks/:id", (req, res) => {
  let renderTasks = localStorage.getItem("tasks");
  const Tasks = JSON.parse(renderTasks);
  const task = Tasks.find((task) => task.id === req.params.id);
  res.render("task", { task: task });
});

app.delete("/tasks/:id", (req, res) => {
  localStorage.removeItem("tasks");
  tasks = tasks.filter((task) => task.id !== req.params.id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  res.redirect("/");
});

app.put("/tasks/:id", (req, res) => {
  let renderTasks = localStorage.getItem("tasks");
  const Tasks = JSON.parse(renderTasks);
  const task = Tasks.find((task) => task.id === req.params.id);
  task.title = req.body.title;
  task.description = req.body.description;
  task.dueDate = req.body.dueDate;
  task.status = req.body.status;
  localStorage.removeItem("tasks");
  localStorage.setItem("tasks", JSON.stringify(Tasks));
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
