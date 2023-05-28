const express = require("express");
const { save } = require("./user/UserService");

const app = express();

// Middleware
app.use(express.json());

app.post("/api/1.0/users", async (req, res) => {
  await save(req.body);
  res.send({ message: "User created" });
});

module.exports = app;
