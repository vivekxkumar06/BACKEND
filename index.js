const express = require("express");

const fs = require("fs");

const users = require("./MOCK_DATA.json");

const app = express();

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
});

app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    
    </ul>
    `;

  res.send(html);
});

// REST API

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id == id);
  return res.json(user);
});

app.post("/api/users", (req, res) => {
  //TOOD : Create new users

  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: users.length });
  });
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
