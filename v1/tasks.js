const express = require('express');
const bodyParser = require('body-parser');
const tasks = express.Router();
//const uuid = require('uuid/v4');

//tasks.get('/', (req, res) => res.status(200).send('Hello World!'));
const postedTasks = [];

tasks.post('/', function (req,res) {
	const newTask = req.body;
	newTask.id = 5;
	postedTasks.push(newTask);
	res.status(201);
	res.json(newTask).send();
});



tasks.put('/:id', (req,res) => {


});


async function updateTaskInDatabase(id, toModify){


	
}

module.exports = tasks;
