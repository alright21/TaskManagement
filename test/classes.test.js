const fetch = require ('node-fetch');
const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = 'http://localhost:' + PORT + '/v1/classes';
const classes = require('../v1/classes').classes;
const insertClassIntoDatabase = require('../v1/classes').insertClassIntoDatabase;
const getClassById = require('../v1/classes').getClassById;
const insertRoles = require('../v1/classes').insertRoles;
const getRoles = require('../v1/classes').getRoles;
const updateClassInDatabase = require('../v1/classes').updateClassInDatabase;

//Some variables used during test cases:
const validId = 1;
const invalidId = 0;
var students = [1,2];
var assistants = [2];
var invalidStud = ['abcd'];
//const invalidIdList = ['cat', 2];
//const validIdStudent = [3,4];
const validAssistantID = [1];

//Example of what a Class should contain
const validClass = {
	'id': 1,
	'name': 'classee1',
	'prof': 1,
	'description': 'Course of SE',
  'students': [{
      "id": 3
    }, {
       "id": 4
     }],
  'assistants': [{
      "id":2} ]
};

const exampleInvalidName =  {
  'id': 1,
	'name': '0',
	'prof': 1,
	'description': 'Course of SE',
};

const exampleInvalidProf =  {
  'id': 1,
	'name': 'classee1',
	'prof': '0',
	'description': 'Course of SE',
};

const exampleModifiedName =  {
  'id': 1,
	'name': 'SEclass',
	'prof': 1,
	'description': 'Course of SE',
};

const exampleModifiedDescription =  {
  'id': 1,
	'name': 'classee1',
	'prof': 1,
	'description': 'This is the class of SE',
};

// Examples of roles
const validStudent = {
  'user': 3,
  'classe': 1,
  'permesso': 2
}

const validAssistant ={
  'user': 1,
  'classe': 1,
  'permesso': 2
}

const invalidStudent = {
  'user': 'p',
  'classe': 1,
  'permesso': 8
}

const invalidAssistant = {
  'user': [3,4],
  'classe': 1,
  'permesso': 8
}

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
  return fetch(SERVER_URL + '/' + id + flag,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
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
	return postClass(validClass) 
		.then(postResponse => {expect(postResponse.status).toBe(201)});
});

//2) Testing wheter the response body is correct.
test('Creation of a valid new Class', () => {

  return postClass(validClass)
  .then(postResponse => {
    expect(postResponse.status).toBe(201);
    return postResponse.json();
  }).then(postResponseJson => {
    expect(postResponseJson.id).not.toBeNull();
    validClass.id = postResponseJson.id;
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

      expect(postResponseJson.id).toEqual(validClass.id);
      expect(postResponseJson.name).toEqual(validClass.name);
      expect(postResponseJson.prof).toEqual(validClass.prof);
      expect(postResponseJson.description).toEqual(validClass.description);
      expect(postResponseJson.students).toEqual(validClass.students);
      expect(postResponseJson.assistants).toEqual(validClass.assistants);
    });
})}); 


/*test('Creation of a valid new student', () => {

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
*/ 

//Invalid test cases

test('if class\'s prof does not exist, the API should return 404', () => {
  return postClass(exampleInvalidProf)
  .then(response => {
    expect(response.status).toBe(404);
  })
});

test('if the students\'s list is incorrect, then the API should return 404', () => {
  return postRole(invalidStudent)
  .then(response =>{
    expect(response.status).toBe(404);
  })
});

test('if the assistant\'s list is incorrect, then the API should return 404', () => {
  return postRole(invalidAssistant)
  .then(response =>{
    expect(response.status).toBe(404);
  })
});

test('if the students\'s list is empty, then the API should return 400', () => {
  return postRole(validStudent.user, null)
  .then(response =>{
    expect(response.status).toBe(400);
  })
});

test('if the assistant\'s list is empty, then the API should return 400', () => {
  return postRole(validAssistant.user, null)
  .then(response =>{
    expect(response.status).toBe(400);
  })
}); 


test('if the prof is invalid, should return null', ()=>{

  return insertClassIntoDatabase(exampleInvalidProf)
  .then(res =>{
    expect(res).toBeNull();
  })
});

//Test fot InsertClassIntoDatabase
test('Verify that a valid class is added to the database correctly', ()=>{
  return insertClassIntoDatabase(validClass)
  .then(created => {
    return getClassById(created.id)
    .then(res =>{
      validClass.id = res.id;
      expect(res.prof).toBe(validClass.prof);
    })
  })
});

//test for insert Role
test('Verify that a student is added to the database correctly', ()=>{
  return insertRoles(validStudent, validStudent.classe, validStudent.permesso)
  .then(created => {
    return getRoles(created.classe, created.permesso)
    .then(res =>{
      validStudent.user = res.user;
      expect(res.classe).toBe(validStudent.classe);
    })
  })
});

test('Verify that an assistant is added to the database correctly', ()=>{
  return insertRoles(validAssistant, validAssistant.classe, validAssistant.permesso)
  .then(created => {
    return getRoles(created.classe, created.permesso)
    .then(res =>{
      validAssistant.user = res.user;
      expect(res.classe).toBe(validAssistant.classe);
    })
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
  return getRole(invalidId)
    .then(response => {
      expect(response.status).toBe(404);
    })
});

//3) TESTING PUT/classes/{id}

test('testing a valid update', () => {
  return updateClass(validClass.id, validClass)
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
  return updateClass(validClass.id, exampleInvalidProf)
  .then(res => {
    expect(res.status).toBe(409);
  });
});


test('if you,as a prof, modify the name of the class, should get the same class updated', ()=>{

  return updateClassInDatabase(validClass.id, exampleModifiedName)
  .then(updatedClass =>{
    return getClassById(updatedClass.id)
    .then(res =>{
      expect(res.id).toEqual(validClass.id);
      expect(res.prof).toEqual(validClass.prof);
      expect(res.description).toEqual(validClass.description);
      expect(res.name).toEqual(exampleModifiedName.name);
    });
  });
});


test('if you,as a prof, modify the description of the class, should get the same class updated', ()=>{

  return updateClassInDatabase(validClass.id, exampleModifiedDescription)
  .then(updated =>{
    return getClassById(updated.id)
    .then(res =>{
      expect(res.id).toEqual(validClass.id);
      expect(res.prof).toEqual(validClass.prof);
      expect(res.name).toEqual(validClass.name);
      expect(res.description).toEqual(exampleModifiedDescription.description);
    });
  });
});

