const express = require('express');
const bodyParser = require('body-parser');
const tasks = express.Router();

tasks.get('/', (req, res) => res.status(200).send('Hello World!'));

module.exports = tasks;