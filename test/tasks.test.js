const fetch = require('node-fetch');
const root = 'http://localhost:3000';

var server; //if "const", it does not work!!

//Example of what a Task should contain
const exampleTask = {
	//'id': 5,
	'creator': 12345,
	'task_type': 1,
	'question': 'Do you like cats?',
	'example': 'Yes, I do!',
	'mark': null,
	'answer_list': []
};

const validUpdate = {

	'creator': 1,
	'task_type': 1,
	'question': 'Do you like dogs?',
	'example': 'Yes, I do!',
	'mark': 30,
	'answer_list': []
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

//Test cases:

// 1) Testing if the post was successful, looking if the status is "201"
test('Post task response', () => {
	return postTask(exampleTask)
		.then(postResponse => {expect(postResponse.status).toBe(201)});
});

// 2) Testing wheter te response body is correct or not.
//First, test if the response is of type 'object'
//Then test if the response json has all the attributes of the exampleTask
//Check then wheter types of properties are correct or not.
//At last test if the JSON can match properties
test('Post task response body', () => {
	return postTask(exampleTask)
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
			expect(postResponseJson).toMatchObject({
				//'id': 5,
				'creator': 12345,
				'task-type': 1,
				'question': 'Do you like cats?',
				'answer-example': 'Yes, I do!',
				'mark': null,
				'answer-list': []
			});
		});
});


test('if the id for the update is null, should return 400', () =>{

	return updateTask(null, validUpdate)
	.then(res => {
		expect(res.status).toBe(400);
	});
});
