const express = require("express");

const path = require("path");
const fs = require("fs/promises");

const jsonPath = path.resolve("data.json");
const jsonPathUsers = path.resolve("users.json");

const app = express();

app.use(express.json());

const getId = (data) => {
  const lastElement = data.length - 1;
  return data[lastElement].id + 1;
};

// app.all("/", (req, res) => {
//   console.log("holis aqui en el server es coool todo");
//   res.end();
// });

// tasks v1.0.0
app.get("/api/v1/tasks", async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, "utf8");
  res.status(200).send(jsonFile);
});

app.post("/api/v1/tasks", async (req, res) => {
  const newTask = req.body;
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));

  tasksArray.push({ ...newTask, id: getId(tasksArray) });

  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));

  res.sendStatus(201);
});

app.put("/api/v1/tasks", async (req, res) => {
  console.log(req.body);
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));

  const { id, status, title, description } = req.body;

  const taskId = tasksArray.findIndex((task) => task.id === id);
  //   tasksArray[taskId].status = status;

  if (title !== undefined) tasksArray[taskId].title = title;
  if (description !== undefined) tasksArray[taskId].description = description;
  if (status !== undefined) tasksArray[taskId].status = status;
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));

  res.sendStatus(200);
});

app.delete("/api/v1/tasks", async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  const { id } = req.body;

  const taskIndex = tasksArray.findIndex((task) => task.id === id);

  tasksArray.splice(taskIndex, 1);

  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));

  res.sendStatus(200);
});

// users v1.0.0

app.get("/api/v1/users", async (req, res) => {
  const users = await fs.readFile(jsonPathUsers, "utf8");
  console.log(users);
  res.status(200).send(users);
});

app.post("/api/v1/users", async (req, res) => {
  const data = req.body;
  const usersArray = JSON.parse(await fs.readFile(jsonPathUsers, "utf8"));
  usersArray.push({ ...data, id: getId(usersArray) });

  await fs.writeFile(jsonPathUsers, JSON.stringify(usersArray), (err) =>
    console.log(err)
  );

  res.sendStatus(201);
});

app.put("/api/v1/users", async (req, res) => {
  const usersArray = JSON.parse(await fs.readFile(jsonPathUsers, "utf8"));
  const { id, email, password, name } = req.body;

  const userIndex = usersArray.findIndex((item) => item.id === id);
  if (email !== undefined) usersArray[userIndex].email = email;
  if (name !== undefined) usersArray[userIndex].name = name;
  if (password !== undefined) usersArray[userIndex].password = password;

  await fs.writeFile(jsonPathUsers, JSON.stringify(usersArray), (err) =>
    console.log(err)
  );

  res.sendStatus(200);
});

app.delete("/api/v1/users", async (req, res) => {
  const usersArray = JSON.parse(await fs.readFile(jsonPathUsers, "utf8"));

  const { id } = req.body;

  const userIndex = usersArray.findIndex((item) => item.id === id);

  usersArray.splice(userIndex, 1);

  await fs.writeFile(jsonPathUsers, JSON.stringify(usersArray));

  res.sendStatus(200);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
