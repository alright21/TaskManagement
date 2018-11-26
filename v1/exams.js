const express = require('express');
const bodyParser = require('body-parser');
const exams = express.Router();


exams.get('/', (req, res) => res.status(200).send('Hello World!'));

module.exports = exams;