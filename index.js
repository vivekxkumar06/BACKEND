const express = require("express");

const fs = require("fs");

const users = require("./MOCK_DATA.json");

const mongoose = require("mongoose");

const app = express();

// Connection

mongoose
  .connect("mongodb://localhost:27017/youtube-app-1")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo Error", err));
// Schema

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    jobTitle: {
      type: String,
    },

    gender: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", userSchema);

// Middleware - plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `${Date.now()} : ${req.ip} : ${req.method} : ${req.path}\n`,
    (err, data) => {
      next();
    },
  );
  next();
});

app.use((req, res, next) => {
  console.log("hello from middleware 2", req.myUserNamec);
  next();
  //   return res.end("hey");
});

app.get("/", (req, res) => {
  res.send("Hello World");

  res.send(html);
});

app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    
    </ul>
    `;
});

// REST API

app.get("/api/users", (req, res) => {
  res.setHeader("X-myName", "anand"); // custam header
  // Always  add X is custam header
  return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id == id);
  if (!user) return res.status(404).json({ error: "users is not found" });
  return res.json(user);
});

app.post("/api/users", async (req, res) => {
  //TOOD : Create new users

  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(404).json({ msg: "All field are req..." });
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  console.log("result", result);
  return res.status(201).json({ msg: "success" });
});

app.patch("/api/users/:id", (req, res) => {
  //TOOD : Edit the user  with  id

  return res.json({ status: "pending" });
});

app.delete("/api/users/:id", (req, res) => {
  //TOOD : Delete the user  with  id

  return res.json({ status: "pending" });
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
});

// short rest api

// app.route("/api/users/:id");
// .get((req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => user.id == id);
//   return res.json(user);
// });

// .patch( (req, res) => {
//   //TOOD : Edit the user  with  id

//   return res.json({ status: "pending" });
// });
