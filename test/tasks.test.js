const fetch = require('node-fetch');
const root = 'http://localhost:3000';

var server; //if "const", it does not work!!

//Example of what a Task should contain
const validTask = {
	//'id': 5,
	"creator": 1,
	"task_type": 1,
	"question": "Do you like cats?",
	"example": "Yes, I do!",
	"mark": null,
	"multiple_choices": null
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
		"id": 1,
		"task": 3,
		"answer": "Yes"
	},{
		"id": 2,
		"task": 3,
		"answer": "No"
	}]
}
//Functions executed before (and after) doing test cases, to open and close
//the server:
beforeAll(function() {
	server = require('../index');
});
afterAll(function() {
	server.close();
});

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

	return fetch(root + 'v1/tasks/' + id, {

		mthod: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(toModify)
	});
}

function getTask(id){
	return fetch(root + 'v1/tasks/' + id, {

		mthod: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	});
}

//Test cases:

// 1) Testing if the post was successful, looking if the status is "201"
test('Post task response', () => {
	return postTask(validTask)
		.then(postResponse => {expect(postResponse.status).toBe(201)});
});

// 2) Testing wheter te response body is correct or not.
//First, test if the response is of type 'object'
//Then test if the response json has all the attributes of the exampleTask
//Check then wheter types of properties are correct or not.
//At last test if the JSON can match properties
test('Post task response body', () => {
	return postTask(validTask)
		.then(postResponse => {return postResponse.json()})
		.then(postResponseJson => {
			//Object Schema
			expect(typeof postResponseJson).toEqual('object');
			expect(postResponseJson).toHaveProperty('id');
			expect(postResponseJson).toHaveProperty('creator');
			expect(postResponseJson).toHaveProperty('task-type');
			expect(postResponseJson).toHaveProperty('question');
			expect(postResponseJson).toHaveProperty('answer-example');
			expect(postResponseJson).toHaveProperty('mark');
			expect(postResponseJson).toHaveProperty('answer-list');
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

test('if the update id is 3, and the modification is correct, should return 201', () => {

	return updateTask(3, validUpdateOpen)
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
			expect(resJson).toHaveProperty('answer_list');

			validUpdateOpen.id = resJson.id;
			expect(resJson).toMatchObject(validUpdateOpen);
		});
	});
});
