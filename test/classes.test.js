const fetch = require('node-fetch');
const root = 'http://localhost:3000';
//const insertClassInToDatabase = require('../v1/classes').classes;

var server;

//Example of what a Class should contain
const exampleValidClass = {
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
test('Post class response, case of a valid new Class', () => {
	return postClass(exampleValidClass)
		.then(postResponse => {expect(postResponse.status).toBe(201)});
});

//2) Testing wheter the response body is correct.
test('Post class response body', () => {
	return postClass(exampleValidClass)
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

//3) Testing for insertClassInToDatabase

//PER POTER FUNZIONARE HO BISOGNO DELLA FUNZIONE DI GET CLASS

/*test('to verify if a valid class is added correctly to the db', () => {
	return insertClassInToDatabase(exampleValidClass)
		.then(created => {
			return getClassById(created.id)
				.then(res => {
					exampleValidClass.id = res.id;
					expect(res.name).toBe(exampleValidClass.name);
				})
		})
});*/

//4) DA INSERIRE DOPO IL GET
// Testare se è valido, allora mi ritorna la classe.