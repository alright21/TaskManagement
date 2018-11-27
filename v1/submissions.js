const express = require('express');
const bodyParser = require('body-parser');
const submissions = express.Router();

submissions.get('/', (req, res) => res.status(200).send('Hello World!'));

module.exports = submissions;