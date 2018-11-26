const express = require('express');
const bodyParser = require('body-parser');
const classes = express.Router();

classes.get('/', (req, res) => res.status(200).send('Hello World!'));

module.exports = classes;