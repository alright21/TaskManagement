const fetch = require ('node-fetch');
const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = 'http://localhost:' + PORT + '/v1/classes';
const exams = require('../v1/classes').classes;
//const insertClassIntoDatabase = require('../v1/classes').insertClassIntoDatabase;
//const getClassById = require('../v1/classes').getClassById;

var server;
const validId = 1;
const invalidId = 0;

//Example of what a Class should contain
const exampleValidClass = {
	//'id': 5,
	'name': 'class1',
	'prof': 'prof1',
	'description': 'Course of SE'
	//'assistants': ['assistant1', 'assistant2'], //NB: array's element are type "user"
	//'students': ['student1', 'student2', 'student3'] //same type of assistants
};

const exampleInvalidName =  {
	'name': '0',
	'prof': 'prof1',
	'description': 'Course of SE'
	//'assistants': ['assistant1', 'assistant2'], //NB: array's element are type "user"
	//'students': ['student1', 'student2', 'student3'] //same type of assistants
};

const exampleInvalidProf =  {
	'name': 'class1',
	'prof': '0',
	'description': 'Course of SE'
	//'assistants': ['assistant1', 'assistant2'], //NB: array's element are type "user"
	//'students': ['student1', 'student2', 'student3'] //same type of assistants
};

/*const exampleInvalidAssist =  {
	'name': 'class1',
	'prof': 'prof1',
	'assistants': ['assistant1', 'assistant2', 'assistant3'], //NB: array's element are type "user"
	'students': ['student1', 'student2', 'student3'] //same type of assistants
};

const exampleInvalidStud =  {
	'name': 'class1',
	'prof': 'prof1',
	'assistants': ['assistant1', 'assistant2'], //NB: array's element are type "user"
	'students': ['student1', 'student2'] //same type of assistants
};*/

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
	return fetch(SERVER_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(newClass)
	});
}

function getClass(id){
  return fetch(SERVER_URL + '/' + id,{
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
}

//Test cases:

// 1) TESTING POST/classes

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
			expect(postResponseJson).toHaveProperty('description');
			//expect(postResponseJson).toHaveProperty('assistants');
			//expect(postResponseJson).toHaveProperty('students');
			//Keys types
			expect(typeof postResponseJson).toEqual('object');
			expect(typeof postResponseJson).toEqual('object');
			expect(typeof postResponseJson).toEqual('string');
			//expect(typeof postResponseJson).toEqual('object');
			//expect(typeof postResponseJson).toEqual('object');
			//Object values
			expect(postResponseJson).toMatchObject({
				//'id': 5,
				'name': 'class1',
				'prof': 'prof1',
				'description': 'Course of SE'
				//'assistants': ['assistant1', 'assistant2'],
				//'students': ['student1', 'student2', 'student3']
			});
		});
});

test('if class\'s prof does not exist, the API should return 400', () => {
  return postClass(exampleInvalidProf)
  .then(response => {
    expect(response.status).toBe(400);
  })
});

/*test('if the assistants\'s list is incorrect, then the API should return 400', () => {
  return postClass(exampleInvalidAssist)
  .then(response =>{
    expect(response.status).toBe(400);
  })
});

test('if the students\'s list is incorrect, then the API should return 400', () => {
  return postClass(exampleInvalidStud)
  .then(response =>{
    expect(response.status).toBe(400);
  })
});*/


//2) TESTING GET/classes/{id}

test('test if valid class id returns the selected class', () => {
  console.log(validId);
  return getClass(validId)
    .then(response => {
      expect(response.status).toBe(200);
      return response.json();
    })
    .then(jsonRes => {
      expect(jsonRes.id).toEqual(validId);
    })
});

test('test if invalid class id returns 404 not found', () => {
  return getClass(invalidId)
    .then(response => {
      expect(response.status).toBe(404);
    })
});

