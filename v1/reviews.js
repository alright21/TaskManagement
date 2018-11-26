const express = require('express');
const bodyParser = require('body-parser');
const reviews = express.Router();

reviews.get('/', (req, res) => res.status(200).send('Hello World!'));

module.exports = reviews;