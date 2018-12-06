const fetch = require ('node-fetch');
const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = 'http://localhost:' + PORT + '/v1/ruoli';
const classes = require('../v1/classes').classes;
const ruoli = require('../v1/ruoli').ruoli;
const insertStudentIntoDatabase = require('../v1/ruoli').insertStudentIntoDatabase;
const insertAssistantIntoDatabase = require('../v1/ruoli').insertAssistantIntoDatabase;
const getStudents = require('../v1/ruoli').getStudents;

//Variables used for testing

const invalidIdList = ['cat', 2];
const validIdStudent = [3,4];

//Examples for testing

const validStudent = {
	'user': [ {
		"id": 3,
	},
	{	
		"id": 4
	}],
	'classe': 1,
	'permesso': 2
}

const validAssistant ={
	'user': [1],
	'classe': 1,
	'permesso': 2
}

const invalidStudent = {
	'user': [3,4],
	'classe': 1,
	'permesso': 8
}

const invalidAssistant = {
	'user': [3,4],
	'classe': 1,
	'permesso': 8
}
//Helper functions

function postRole(newUser){
	return fetch(SERVER_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(newUser)
	});
}

function getRole(id, flag){
  return fetch(SERVER_URL + '/' + id,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

//Test cases

//Valid POST of students
test('Creation of a valid new student', () => {

  return postRole(validStudent)
  	.then( postResponse => {
    expect(postResponse.status).toBe(201);
    return postResponse.json();
  }).then(postResponseJson => {
    expect(postResponseJson.user).not.toBeNull();
    validStudent.user = postResponseJson.user;
    return getRole(postResponseJson.user).then(postResponse => {
      expect(postResponse.status).toBe(200);
      return postResponse.json();
    }).then(postResponseJson => {
      expect(postResponseJson).toHaveProperty('user');
      expect(postResponseJson).toHaveProperty('classe');
      expect(postResponseJson).toHaveProperty('permesso');
      expect(postResponseJson.user).toEqual(validStudent.user);
      expect(postResponseJson.classe).toEqual(validStudent.classe);
      expect(postResponseJson.permesso).toEqual(validStudent.permesso);
    });
})});

//Valid post of an assistant
test('Creation of a valid new assistant', () => {

  return postRole(validAssistant)
  	.then( postResponse => {
    expect(postResponse.status).toBe(201);
    return postResponse.json();
  }).then(postResponseJson => {
    expect(postResponseJson.user).not.toBeNull();
    validAssistant.user = postResponseJson.user;
    return getRole(postResponseJson.user).then(postResponse => {
      expect(postResponse.status).toBe(200);
      return postResponse.json();
    }).then(postResponseJson => {
   	  expect(typeof postResponseJson.user).toEqual('array');
	  expect(typeof postResponseJson.classe).toEqual('integer');
	  expect(typeof postResponseJson.permesso).toEqual('integer');
      expect(postResponseJson).toHaveProperty('user');
      expect(postResponseJson).toHaveProperty('classe');
      expect(postResponseJson).toHaveProperty('permesso');
      expect(postResponseJson.user).toEqual(validAssistant.user);
      expect(postResponseJson.classe).toEqual(validAssistant.classe);
      expect(postResponseJson.permesso).toEqual(validAssistant.permesso);
    });
})});

// Invalid post request

test('if the students\'s list is incorrect, then the API should return 400', () => {
  return postRole(invalidStudent)
  .then(response =>{
    expect(response.status).toBe(404);
  })
});

test('if the assistant\'s list is incorrect, then the API should return 400', () => {
  return postRole(invalidAssistant)
  .then(response =>{
    expect(response.status).toBe(404);
  })
});

test('if the students\'s list is empty, then the API should return 404', () => {
  return postRole(validStudent.user, null)
  .then(response =>{
    expect(response.status).toBe(404);
  })
});

test('if the assistant\'s list is empty, then the API should return 404', () => {
  return postRole(validAssistant.user, null)
  .then(response =>{
    expect(response.status).toBe(404);
  })
});

test('Verify that a Student is added to the database correctly', ()=>{

	for (var i in validStudent.user)
	{
  return insertStudentIntoDatabase(validIdStudent.user, validStudent.classe)
  	.then(created => {
  		console.log('created: ' +created)
    return getRole(created.id)
    .then(res =>{
      validStudent.user = res.user;
      expect(res.classe).toBe(validStudent.classe);
    })
  })
  }
});

test('Verify that an Assistant is added to the database correctly', ()=>{
  return insertAssistantIntoDatabase(validAssistant.user)
  	.then(created => {
    return getAssistant(created.user)
    .then(res =>{
      validAssistant.user = res.user;
      expect(res.classe).toBe(validAssistant.classe);
    })
  })
});

//Testing the GET APIs

test('test if valid Role id returns the selected list of users', () => {
  return getRole(validStudent.user, validStudent.permesso)
    .then(response => {
      expect(response.status).toBe(200);
      return response.json();
    })
    .then(jsonRes => {
      expect(jsonRes.user).toEqual(validStudent.user);
      expect(jsonRes.classe).toEqual(validStudent.classe);
    })
});


test('test if valid Role id returns the selected list of users', () => {
  return getRole(validAssistant.user, validAssistant.permesso)
    .then(response => {
      expect(response.status).toBe(200);
      return response.json();
    })
    .then(jsonRes => {
      expect(jsonRes.user).toEqual(validAssistant.user);
      expect(jsonRes.classe).toEqual(validAssistant.classe);
    })
});

test('if the id does not exists, it should return 404', () => {
  return getRole(invalidIdList)
    .then(response => {
      expect(response.status).toBe(404);
    })
});
