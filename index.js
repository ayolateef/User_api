const Joi = require("joi");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json({}));

const users = [];

/**
 * GET all users
 */

app.get("/api/users/", (req, res) => {
  res.send(users);
});

/**
 * GET single user
 */
app.get("/api/users/:id", (req, res) => {
  const user = users.find((c) => c.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User with ID not found");
  res.send(user);
});

/**
 * Create users
 */
app.post("/api/users", (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { first_name, last_name, email, password } = req.body;

  const user = {
    id: Date.now(),
    first_name,
    last_name,
    email,
    password,
  };
  const salt = bcrypt.genSalt(10);
  user.password = bcrypt.hash(user.password, salt);

  users.push(user);
  res.status(201).send(user);
});

/**
 * Update users
 */
app.put("/api/users/:id", (req, res) => {
  const user = users.find((c) => c.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User with ID not found");


  user.name = req.body.name;
  res.send(user);
});
/**
 * Delete users
 */
app.delete("/api/users/:id", (req, res) => {
  const user = users.find((c) => c.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User with ID not found");

  const index = users.indexOf(user);
  users.splice(index, 1);

  res.send(user);
});

function validateUser(user) {
  const schema = Joi.object({
    first_name: Joi.string().min(3).max(25).required(),
    last_name: Joi.string().min(3).max(25).required(),
    email: Joi.string().min(3).required(),
    password: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(user);
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`app listening on PORT ${port}...`));
