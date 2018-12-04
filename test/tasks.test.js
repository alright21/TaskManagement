const fetch = require('node-fetch');
const root = 'http://localhost:3000';

const insertTaskInDatabase = require('../v1/tasks').insertTaskInDatabase;
const insertMultipleChoices = require('../v1/tasks').insertMultipleChoices;
const getTaskById = require('../v1/tasks').getTaskById;
const getMultipleChoices = require('../v1/tasks').getMultipleChoices;
const getMultipleChoice = require('../v1/tasks').getMultipleChoice;
const updateTaskInDatabase = require('../v1/tasks').updateTaskInDatabase;
const updateMultipleChoices = require('../v1/tasks').updateMultipleChoices;

var server; //if "const", it does not work!!

//Example of what a Task should contain
const validTask = {
	"creator": 1,
	"task_type": 1,
	"question": "Do you like cats?",
	"example": "Yes, I do!",
	"mark": 30,
	"multiple_choices": [{
		"answer": "Yes"
	},{
		"answer": "No"
	}]
};

const validUpdateOpen = {

	"creator": 1,
	"task_type": 0,
	"question": "Do you like dogs?",
	"example": "Yes, I do!",
	"mark": 30,
	"multiple_choices": null
}

const validUpdateClose = {

	"creator": 1,
	"task_type": 1,
	"question": "Do you like cows?",
	"example": "Yes",
	"mark": 30,
	"multiple_choices": [{
		"id": 3,
		"task": 3,
		"answer": "Yes"
	},{
		"id": 4,
		"task": 3,
		"answer": "No"
	}]
}
const nullCreatorUpdate = {
	"creator": null,
	"task_type": 0,
	"question": "Do you like dogs?",
	"example": "Yes, I do!",
	"mark": 30,
	"multiple_choices": null
}

const invalidCreatorUpdate = {
	"creator": 10000,
	"task_type": 0,
	"question": "Do you like dogs?",
	"example": "Yes, I do!",
	"mark": 30,
	"multiple_choices": null
}

const nullMarkTask = {
	"creator": 10000,
	"task_type": 0,
	"question": "Do you like dogs?",
	"example": "Yes, I do!",
	"mark": null,
	"multiple_choices": null
}

const invalidTaskMultipleChoices = {

	"creator": 1,
	"task_type": 1,
	"question": "Do you like cows?",
	"example": "Yes",
	"mark": 30,
	"multiple_choices": [{
		"id": null,
		"task": 3,
		"answer": "Yes"
	},{
		"id": 2,
		"task": 3,
		"answer": "No"
	}]
}

const validMultipleChoices = [
	{
		"id": 3,
		"task": 3,
		"answer": "YesYesYes"
	},{
		"id": 4,
		"task": 3,
		"answer": "NoNoNo"
	}
];

const invalidMultipleChoices = [
	{
		"id": null,
		"task": 3,
		"answer": "Yes"
	},{
		"id": 2,
		"task": 3,
		"answer": "No"
	}
];

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const validInsertMultipleChoices = [
	{
		
		"task": 2,
		"answer": "Maybe"
	},{
		
		"task": 2,
		"answer": "Sure"
	
	}
];

const nullMultipleChoicesTask = {
	"creator": 1,
	"task_type": 1,
	"question": "Do you like cats?",
	"example": "Yes, I do!",
	"mark": 30,
	"multiple_choices": null
};
//Functions executed before (and after) doing test cases, to open and close
//the server:
beforeAll(function() {
	server = require('../index');
});
afterAll(function() {
	server.close();
});

=======
>>>>>>> Remove server start inside test files. Now server start before executing npm test.
=======
>>>>>>> Remove server start inside test files. Now server start before executing npm test.
=======
>>>>>>> b5554418e2949a80b93d3e581f3f3393c2db5165
//Little function useful as an helper function, with a Promise:

const postTask = function(newTask){
	return fetch(root + '/v1/tasks', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(newTask)
	});
}


function updateTask(id, toModify){

	return fetch(root + '/v1/tasks/' + id, {

		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(toModify)
	});
}

function getTask(id){
	return fetch(root + '/v1/tasks/' + id, {

		mthod: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	});
}

//Test cases:

// 1) Testing if the post was successful, looking if the status is "201"

// 2) Testing wheter te response body is correct or not.
//First, test if the response is of type 'object'
//Then test if the response json has all the attributes of the exampleTask
//Check then wheter types of properties are correct or not.
//At last test if the JSON can match properties
test('Post task response body', () => {
	return postTask(validTask)
		.then(postResponse => {
			expect(postResponse.status).toBe(201);
			return postResponse.json()})
		.then(postResponseJson => {
			validTask.id = postResponseJson.id;
			//Object Schema
			expect(typeof postResponseJson).toEqual('object');
			expect(postResponseJson).toHaveProperty('id');
			expect(postResponseJson).toHaveProperty('creator');
			expect(postResponseJson).toHaveProperty('task_type');
			expect(postResponseJson).toHaveProperty('question');
			expect(postResponseJson).toHaveProperty('example');
			expect(postResponseJson).toHaveProperty('mark');
			expect(postResponseJson).toHaveProperty('multiple_choices');
			//Keys types
			expect(typeof postResponseJson).toEqual('object');
			expect(typeof postResponseJson).toEqual('object');
			expect(typeof postResponseJson).toEqual('object');
			expect(typeof postResponseJson).toEqual('object');
			expect(typeof postResponseJson).toEqual('object');
			expect(typeof postResponseJson).toEqual('object');
			expect(typeof postResponseJson).toEqual('object');
			//Object values
			expect(postResponseJson).toMatchObject(validTask);
		});
});


test('if the id for the update is null, should return 400', () =>{

	return updateTask(null, validUpdateOpen)
	.then(res => {
		expect(res.status).toBe(400);
	});
});

test('if the id for the update is 0, should return 400', () => {

	return updateTask(0, validUpdateOpen)
	.then(res => {
		expect(res.status).toBe(400);
	});
});

test('if the creator of the update is null, should return 409', () => {

	return updateTask(3, nullCreatorUpdate)
	.then(res => {
		expect(res.status).toBe(409);
	});
});

test('if the creator does not exist, should return 409', () => {
	return updateTask(3, invalidCreatorUpdate)
	.then(res => {
		expect(res.status).toBe(409);
	});
});

test('if the mark of the update is null, should return 409', () => {
	return updateTask(3, nullMarkTask)
	.then(res => {
		expect(res.status).toBe(409);
	});

});

test('if the multiple choices have invalid id, should return 409', () => {
	return updateTask(3, invalidTaskMultipleChoices)
	.then(res => {
		expect(res.status).toBe(409);
	});
});





test('if the update id is 3 and the task is an close question, and the modification is correct, should return 201', () => {

	return updateTask(3, validUpdateClose)
	.then(res => {
		expect(res.status).toBe(201);
		return getTask(3)
		.then(res => {
			expect(res.status).toBe(200);
			return res.json();
		}).then(resJson => {
			expect(resJson).toHaveProperty('id');
			expect(resJson).toHaveProperty('creator');
			expect(resJson).toHaveProperty('task_type');
			expect(resJson).toHaveProperty('question');
			expect(resJson).toHaveProperty('example');
			expect(resJson).toHaveProperty('mark');
			

			validUpdateOpen.id = resJson.id;
			expect(resJson).toMatchObject(validUpdateClose);
		});
	});
});


//tests for updateMultipleChoices

test('if argument length is not 1, should return null', () => {
	return updateMultipleChoices(validMultipleChoices, 1)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if the multipleChoices is null, should return null', () => {
	return updateMultipleChoices(null)
	.then(res => {
		 expect(res).toBeNull();
	}) 
});

test('if multipleChoices are invalid, should return null', () => {

	return updateMultipleChoices(invalidMultipleChoices)
	.then(res => {
		expect(res).toBeNull();
	})
});

test('if the mutiple Choices array is valid, should return the array updated', () =>{
	return updateMultipleChoices(validMultipleChoices)
	.then(res => {
		expect(res).toMatchObject(validMultipleChoices);
	})
});


// tests for updateTaskInDatabase


test('if the argument length is != 2 should return null', () => {
	return updateTaskInDatabase(validTask.id)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if the id is null, should return null', () => {
	return updateTaskInDatabase(null, validUpdateClose)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if the modified Task is null, should return null', () => {
	return updateTaskInDatabase(3, null)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if the modified task has mark null, should return null', () => {

	return updateTaskInDatabase(3, nullMarkTask)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if the modified task does not exists in the database, should return null', () => {
	return updateTaskInDatabase(10000, validTask)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if the creator does not exists, should return null', () => {

	return updateTaskInDatabase(3, invalidCreatorUpdate)
	.then(res => {
		expect(res).toBeNull();
	});
});


test('if the update is valid, should return the task updated', () => {

	return updateTaskInDatabase(3, validUpdateClose)
	.then(res => {
		expect(res).toMatchObject(validUpdateClose);
	});
});

//test for insertMultipleChoices

test('if argument length  of insertMultipleChoicesis !== 2 should return null', () => {
	 
	return insertMultipleChoices(validMultipleChoices,validTask.id, validTask)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if multiple choices of insertMultipleChoices are null, should return null', () => {

	return insertMultipleChoices(null, validTask.id)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if multiple choices of insertMultipleChoices are valid, should return the array of the multiple choices created', () => {

	return insertMultipleChoices(validInsertMultipleChoices, 2)
	.then(res => {
		
		for(let i = 0; i< res.length; i++){
			validInsertMultipleChoices[i].id = res[i].id;
		}
		return getMultipleChoices(2);
	}).then(res => {
		expect(res).toMatchObject(validInsertMultipleChoices);
	});
});


// test for insertTaskInDatabase

test('if argument length of insertTaskInDatabase is !== 1, should return null', () => {

	return insertTaskInDatabase()
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if new task of insertTaskInDatabase is null, should return null', () => {
	return insertTaskInDatabase(null)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if the mark of the task is null of insertTaskInDatabase, should return null', () => {
	return insertTaskInDatabase(nullMarkTask)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if the creator of the task in insertTaskInDatabase is null, should return null', () => {
	return insertTaskInDatabase(nullCreatorUpdate)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if the task is Closed question in insertTaskInDatabase and has no multiple choices, should return null', () => {
	return insertTaskInDatabase(nullMultipleChoicesTask)
	.then(res => {
		expect(res).toBeNull();
	});
});

test('if a task is correct, should return the task created', () => {
	return insertTaskInDatabase(validTask)
	.then(res => {
		validTask.id = res.id;
		for(let i =0 ; i< res.multiple_choices.length; i++){
			validTask.multiple_choices[i].id = res.multiple_choices[i].id;
			validTask.multiple_choices[i].task = res.id;
		
		}
		
		return getTaskById(res.id);

	}).then(getRes => {
		expect(getRes).toMatchObject(validTask);
	});
});




