const fetch = require('node-fetch');
const root = 'http://localhost:3000';

var server;

//Example of what a Class should contain
const exampleClass = {
	//'id': 5,
	'name': 'class1',
	'prof': 'prof1',
	'assistants': ['assistant1', 'assistant2'], //NB: array's element are type "user"
	'students': ['student1', 'student2', 'student3'] //same type of assistants
};

//Functions executed before (and after) doing test cases, to open and close
//the server:
beforeAll(function() {
	server = require('../index');
});
afterAll(function() {
	server.close();
});

//Little function useful as an helper function, with a Promise:


const postClass = function(newClass){
	return fetch(root + '/v1/classes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(newClass)
	});
}

//Test cases:

// 1) Testing if the post was successful, looking if the status is "201"
test('Post class response', () => {
	return postClass(exampleClass)
		.then(postResponse => {expect(postResponse.status).toBe(201)});
});

test('Post class response body', () => {
	return postClass(exampleClass)
		.then(postResponse => {return postResponse.json()})
		.then(postResponseJson => {
			//Object Schema
			expect(typeof postResponseJson).toEqual('object');
			expect(postResponseJson).toHaveProperty('name');
			expect(postResponseJson).toHaveProperty('prof');
			expect(postResponseJson).toHaveProperty('assistants');
			expect(postResponseJson).toHaveProperty('students');
			//Keys types
			expect(typeof postResponseJson).toEqual('object');
			expect(typeof postResponseJson).toEqual('object');
			expect(typeof postResponseJson).toEqual('object');
			expect(typeof postResponseJson).toEqual('object');
			//Object values
			expect(postResponseJson).toMatchObject({
				//'id': 5,
				'name': 'class1',
				'prof': 'prof1',
				'assistants': ['assistant1', 'assistant2'],
				'students': ['student1', 'student2', 'student3']
			});
		});
});
