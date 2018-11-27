const express = require('express');
const bodyParser = require('body-parser');
const classes = express.Router();

//classes.get('/', (req, res) => res.status(200).send('Hello World!'));

const postedClasses = [];

classes.post('/', function(req, res) {
	const newClass = req.body;
	newClass.id = 1;
	postedClasses.push(newClass);
	res.status(201);
	res.json(newClass).send();
});

module.exports = classes;
