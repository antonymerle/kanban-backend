/*
---
Auteur: Antony Merle
Date: 2022-11-04
---
*/
require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 3000;

server.listen(port, "localhost");

let { uuidv4, tasks } = require("./fakeData");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*
 *
 **
 **** socket.io
 **
 *
 */
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected.`);

  socket.on("taskDragged", (data) => {
    const { source, destination } = data;

    const itemDragged = {
      ...tasks[source.droppableId].items[source.index],
    };

    // Remove dragged item
    tasks[source.droppableId].items.splice(source.index, 1);

    // Insert draggedItem au bon index, dans sa colonne de destination
    tasks[destination.droppableId].items.splice(
      destination.index,
      0,
      itemDragged
    );

    socket.emit("tasks", tasks);
  });

  socket.on("addTask", (data) => {
    const { task, userId } = data;
    console.log(data);
    const newTask = {
      id: uuidv4(),
      title: task,
      comments: [],
    };

    tasks.pending.items.push(newTask);

    socket.emit("tasks", tasks);
  });

  socket.on("addComment", (data) => {
    const { category, userId, comment, id } = data;

    tasks[category].items.filter((task) => {
      task.id === id;
      task.comments.push({ id: uuidv4(), name: userId, text: comment });
      socket.emit("comment", task.comments);
      console.log(tasks[category].items.comments);
    });
  });

  socket.on("fetchComments", (data) => {
    const { category, id } = data;

    tasks[category].items.filter((task) => {
      task.id === id;
      socket.emit("comment", task.comments);
    });
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log(`User ${socket.id} disconnected`);
  });
});

/*
 *
 **
 **** Express
 **
 *
 */

app.get("/api", (req, res) => {
  res.json(tasks);
});

// @route   GET /api/:category/:id
// @desc    Get a specific task by category and id
// @access  PUBLIC

app.get("/api/:category/:id", (req, res) => {
  const category = req.params.category;
  const id = req.params.id;

  if (!category || !id) {
    return res.status(400).json({ msg: "category or id missing" });
  }

  const task = tasks[category].items.filter((task) => task.id === id);
  console.log(task);

  res.json(task);
});

app.get("/", (req, res) => {
  res.send("Hello world");
});
