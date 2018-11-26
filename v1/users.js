const express = require('express');
const bodyParser = require('body-parser');
const users = express.Router();
const uuid = require('uuid-v4');

const postedUsers = [];

// users.get('/', (req, res) => res.status(200).send('Hello World!'));

users.post('/', function (req, res) {
   const newUser = req.body;
   newUser.id = uuid();
   postedUsers.push(newUser);
   res.status(201);
   res.json(newUser).send();
})

module.exports = users;