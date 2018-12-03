const fetch = require ('node-fetch');
const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = 'http://localhost:' + PORT + '/v1/classes';
const exams = require('../v1/classes').classes;
const insertClassIntoDatabase = require('../v1/classes').insertClassIntoDatabase;
const getClassById = require('../v1/classes').getClassById;
const updateClassInDatabase = require('../v1/classes').updateClassInDatabase;


var server;
const validId = 1;
const invalidId = 0;

//Example of what a Class should contain
const exampleValidClass = {
	'id': 1,
	'name': 'classee1',
	'prof': 1,
	'description': 'Course of SE',
	'assistants': [2], //NB: array's element are type "user"
	'students': [3,4] //same type of assistants
};

const exampleInvalidName =  {
  'id': 1,
	'name': '0',
	'prof': 1,
	'description': 'Course of SE'
	//'assistants': ['assistant1', 'assistant2'], //NB: array's element are type "user"
	//'students': ['student1', 'student2', 'student3'] //same type of assistants
};

const exampleInvalidProf =  {
  'id': 1,
	'name': 'classee1',
	'prof': '0',
	'description': 'Course of SE'
	//'assistants': ['assistant1', 'assistant2'], //NB: array's element are type "user"
	//'students': ['student1', 'student2', 'student3'] //same type of assistants
};

const exampleModifiedName =  {
  'id': 1,
	'name': 'SEclass',
	'prof': 1,
	'description': 'Course of SE'
	//'assistants': ['assistant1', 'assistant2'], //NB: array's element are type "user"
	//'students': ['student1', 'student2', 'student3'] //same type of assistants
};

const exampleModifiedDescription =  {
  'id': 1,
	'name': 'classee1',
	'prof': 1,
	'description': 'This is the class of SE'
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


function postClass(newClass){
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
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

function updateClass(id,toModify){
  return fetch(SERVER_URL + '/' + id,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(toModify)
  });
}


//Test cases:

// 1) TESTING POST/classes

test('Post class response, case of a valid new Class', () => {
	return postClass(exampleValidClass) 
		.then(postResponse => {expect(postResponse.status).toBe(201)});
});

//2) Testing wheter the response body is correct.
test('Creation of a valid new Class', () => {

  return postClass(exampleValidClass)
  .then(postResponse => {
    expect(postResponse.status).toBe(201);
    return postResponse.json();
  }).then(postResponseJson => {
    expect(postResponseJson.id).not.toBeNull();
    exampleValidClass.id = postResponseJson.id;
    return getClass(postResponseJson.id).then(postResponse => {
      expect(postResponse.status).toBe(200);
      return postResponse.json();
    }).then(postResponseJson => {
      expect(postResponseJson).toHaveProperty('id');
      expect(postResponseJson).toHaveProperty('name');
      expect(postResponseJson).toHaveProperty('prof');
      expect(postResponseJson).toHaveProperty('description');
      expect(postResponseJson).toHaveProperty('students');
      expect(postResponseJson).toHaveProperty('assistants');

      expect(postResponseJson.id).toEqual(exampleValidClass.id);
      expect(postResponseJson.name).toEqual(exampleValidClass.name);
      expect(postResponseJson.prof).toEqual(exampleValidClass.prof);
      expect(postResponseJson.description).toEqual(exampleValidClass.description);
      expect(postResponseJson.students).toEqual(exampleValidClass.students);
      expect(postResponseJson.assistants).toEqual(exampleValidClass.assistants);
    });
})});


test('if class\'s prof does not exist, the API should return 404', () => {
  return postClass(exampleInvalidProf)
  .then(response => {
    expect(response.status).toBe(404);
  })
});

/*
test('if the students\'s list is incorrect, then the API should return 400', () => {
  return postClass(exampleInvalidStud)
  .then(response =>{
    expect(response.status).toBe(400);
  })
});*/

//Test fot InsertClassIntoDatabase
test('Verify that a valid class is added to the database correctly', ()=>{
  return insertClassIntoDatabase(exampleValidClass)
  .then(created => {
    return getClassById(created.id)
    .then(res =>{
      exampleValidClass.id = res.id;
      expect(res.prof).toBe(exampleValidClass.prof);
    })
  })
});

test('if the prof is invalid, should return null', ()=>{

  return insertClassIntoDatabase(exampleInvalidProf)
  .then(res =>{
    expect(res).toBeNull();
  })
});


//2) TESTING GET/classes/{id}

test('if the arguments length is 0, should return null', () =>{
  return getClassById()
  .then(res =>{
    expect(res).toBeNull();
  })
})

test('test if valid class id returns the selected class', () => {
  //console.log(validId);
  return getClass(validId)
    .then(response => {
      expect(response.status).toBe(200);
      return response.json();
    })
    .then(jsonRes => {
      expect(jsonRes.id).toEqual(validId);
    })
});

test('if the id does not exists, it should return 404', () => {
  return getClass(invalidId)
    .then(response => {
      expect(response.status).toBe(404);
    })
});



//3) TESTING PUT/classes/{id}

test('testing a valid update', () => {
  return updateClass(exampleValidClass.id, exampleValidClass)
  .then(res => {
    expect(res.status).toBe(201);
    return res.json();
  }).then(resJson =>{
    return getClassById(resJson.id);
  }).then(ModifiedClass =>{
      expect(ModifiedClass).toHaveProperty('id');
      expect(ModifiedClass).toHaveProperty('name');
      expect(ModifiedClass).toHaveProperty('prof');
      expect(ModifiedClass).toHaveProperty('description');
  });
});


// Not modificable field: prof
test('if someone tries to modify the prof, should return 409', () => {
  return updateClass(exampleValidClass.id, exampleInvalidProf)
  .then(res => {
    expect(res.status).toBe(409);
  });
});


test('if you,as a prof, modify the name of the class, should get the same class updated', ()=>{

  return updateClassInDatabase(exampleValidClass.id, exampleModifiedName)
  .then(updatedClass =>{
    return getClassById(updatedClass.id)
    .then(res =>{
      expect(res.id).toEqual(exampleValidClass.id);
      expect(res.prof).toEqual(exampleValidClass.prof);
      expect(res.description).toEqual(exampleValidClass.description);
      expect(res.name).toEqual(exampleModifiedName.name);
    });
  });
});


test('if you,as a prof, modify the description of the class, should get the same class updated', ()=>{

  return updateClassInDatabase(exampleValidClass.id, exampleModifiedDescription)
  .then(updated =>{
    return getClassById(updated.id)
    .then(res =>{
      expect(res.id).toEqual(exampleValidClass.id);
      expect(res.prof).toEqual(exampleValidClass.prof);
      expect(res.name).toEqual(exampleValidClass.name);
      expect(res.description).toEqual(exampleModifiedDescription.description);
    });
  });
});

