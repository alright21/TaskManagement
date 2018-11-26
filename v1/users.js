const express = require('express');
const bodyParser = require('body-parser');
const users = express.Router();

users.get('/', (req, res) => res.status(200).send('Hello World!'));

module.exports = users;