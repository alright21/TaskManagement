const fetch = require ('node-fetch');
const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:' + PORT;
const root = SERVER_URL;

const getUserByID = require('../v1/users').getUserById;
const updateUserDB = require('../v1/users').updateUserInDatabase;
const logUserFun = require('../v1/users').getUserByEmailAndPassword;

const exampleUser = {'name': 'Mario','surname': 'Rossi','email': 'mario.rossi@gmail.com','password': 'password'};
const exampleUser2 = {'name': 'Marione','surname': 'Razzi','email': 'marione.razzi@gmail.com','password': 'a'};
const exampleUser3 = {'name': 'Darione','surname': 'Rassi','email': 'darione.rassi@gmail.com','password': 'b'};
const exampleUser4 = {'name': 'One','surname': 'Time','email': 'one.time@gmail.com','password': 'c'};
const exampleUser5 = {'name': 'Two','surname': 'Time','email': 'two.time@gmail.com','password': 'd'};
const exampleUser6 = {'name': 'Three','surname': 'Time','email': 'three.time@gmail.com','password': 'e'};
const exampleUser7 = {'name': 'Four','surname': 'Time','email': 'four.time@gmail.com','password': 'f'};
const wrongUser = {'name': null,'surname': 'Time','email': 'one.time@gmail.com','password': 'c'};
const wrongUser2 = {'name': 'One','surname': null,'email': 'one.time@gmail.com','password': 'c'};
const wrongUser3 = {'name': 'One','surname': 'Time','email': null,'password': 'c'};
const wrongUser4 = {'name': 'One','surname': 'Time','email': 'one.time@gmail.com','password': null};
const wrongUser5 = {'name': 'One','surname': 'Time','email': 'one.time@gmail.com','password': 'azz'};
const putUser = {'name': 'Four','surname': 'Time','email': 'four.time@gmail.com','password': 'abba'};
const exampleUserID = 1;
const invalidEmail = 'blasfv0';
const invalidPwd = 'vajf';

const validtask={
  id: 1,
  creator:1,
  task_type: 1,
  question: "blablabla",
  example: "blablabla",
  mark: 30
};
const validexam={
  id: 1,
  creator: 1,
  deadline: 550,
  mark: 30
};

var invalidid=-1;

//--------------------------------------------
//					HELPER FUNCTIONS
//--------------------------------------------

const postUser = function(newUser){
   return fetch(SERVER_URL + '/v1/users', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
      },
      body: JSON.stringify(newUser)
   });
}

const getUser = function(userID){
	return fetch(SERVER_URL + '/v1/users/' + userID, {
		method: 'GET',
		headers: {
			'Accept': 'application/json'
		}
	});
};

const getExams = function(userID){
  return fetch(root + '/v1/users/' + userID +'/exams', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
};

const getTasks = function(userID){
  return fetch(root + '/v1/users/' + userID +'/tasks', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
};
const getReviews = function(userID){
  return fetch(root + '/v1/users/' + userID +'/reviews', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
};

const getSubmissions = function(userID){
  return fetch(root + '/v1/users/' + userID +'/submissions', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
};


const updateUser = function(id, toModify){
	return fetch(SERVER_URL + '/v1/users/' + id,{
		method: 'PUT',
		headers: {
		 'Content-Type': 'application/json',
		 'Accept': 'application/json'
		},
		body: JSON.stringify(toModify)
	});
};

const getUsersList = function(){
	return fetch(SERVER_URL + '/v1/users', {
		method: 'GET',
		headers: {
			'Accept': 'application/json'
		}
	})
};

const deleteUser = function(userID){
return fetch(root + '/v1/users/' + userID, {
	method: 'DELETE',
	headers: {
		'Accept': 'application/json'
	}
});
};

const logUser = function(uemail, upassword){
	return fetch(SERVER_URL + '/v1/users/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({email: uemail, password: upassword})
	});
};

//--------------------------------------------
//							TESTS
//--------------------------------------------

//POST USER
//#########################


test('delete valid user',()=>{
    return deleteUser(2)
    .then(res=>{
      expect(res.status).toBe(204);
  })
});


test('delete invalid user',()=>{
    return deleteUser(invalidid)
    .then(res=>{
      expect(res.status).toBe(404);
  })
});


describe('POST USER TESTS', () => {

	test('POST user response', () => {
		return postUser(exampleUser4)
			.then(postResponse => {expect(postResponse.status).toBe(201)});
	});

	test('POST and get response', () => {
		return postUser(exampleUser)
			.then(postResponse => { return postResponse.json(); })
			.then(postResponseJson => {
				exampleUser.id = postResponseJson.id;
				return getUser(exampleUser.id);
			})
			.then(getResponse => {return getResponse.json();})
			.then(jsonResponse => {expect(jsonResponse).toEqual(exampleUser)});
	});

	test('POST user with wrong name', () => {
		return postUser(wrongUser)
			.then(postResponse => {expect(postResponse.status).toBe(400)});
	});

	test('POST user with wrong surname', () => {
		return postUser(wrongUser2)
			.then(postResponse => {expect(postResponse.status).toBe(400)});
	});

	test('POST user with wrong email', () => {
		return postUser(wrongUser3)
			.then(postResponse => {expect(postResponse.status).toBe(400)});
	});


	test('POST user with wrong password', () => {
		return postUser(wrongUser4)
			.then(postResponse => {expect(postResponse.status).toBe(400)});
	});


	test('POST user with email already in db', () => {
		return postUser(wrongUser5)
			.then(postResponse => {expect(postResponse.status).toBe(400)});
	});
});

//GET USER
//#########################

describe('GET USER TESTS', () => {

	test('GET user response', () => {
		return postUser(exampleUser2)
			.then(postResponse => {return postResponse.json()})
			.then(json => {return getUser(json.id)})
			.then(getResponse => {expect(getResponse.status).toBe(200)});
	});

	test('GET user response if not found', () => {
		return getUser(0)
			.then(getResponse => {expect(getResponse.status).toBe(400)});
	});

	test('GET user response body if found', () => {
		let returnedID = -1;
		return postUser(exampleUser3)
			.then(postResponse => {return postResponse.json()})
			.then(json => {
				returnedID = json.id;
				return getUser(json.id)})
			.then(getResponse => {return getResponse.json()})
			.then(getResponseJson => {
				//Object schema
				expect(typeof getResponseJson).toEqual('object');
				expect(getResponseJson).toHaveProperty('id');
				expect(getResponseJson).toHaveProperty('name');
				expect(getResponseJson).toHaveProperty('surname');
				expect(getResponseJson).toHaveProperty('email');
				expect(getResponseJson).toHaveProperty('password');
				//Keys types
				expect(typeof getResponseJson.id).toEqual('number')
				expect(typeof getResponseJson.name).toEqual('string');
				expect(typeof getResponseJson.surname).toEqual('string');
				expect(typeof getResponseJson.email).toEqual('string');
				expect(typeof getResponseJson.password).toEqual('string');
				//Object values
				expect(getResponseJson).toMatchObject({
						'id': returnedID,
						'name': 'Darione',
						'surname': 'Rassi',
						'email': 'darione.rassi@gmail.com',
						'password': 'b'
				});
		});
	});
});

// GET USERS
//#########################

describe('GET USERS', () => {

	test('GET users response status if correct', () => {
		return getUsersList()
			.then(getResponse => {expect(getResponse.status).toBe(200)});
	});

	test('GET users response body if correct', () => { //TEST MOLTO PESANTE CON LISTA LUNGA
		return postUser(exampleUser5)
			.then(postResponse5 => {
				return postUser(exampleUser6);
			})
			.then(postResponse6 => {
				return getUsersList();
			})
			.then(getResponse => {return getResponse.json()})
			.then(getResponseJson => {

				let addedIDs = [];
				getResponseJson.forEach(user => {
					expect(typeof user).toEqual('object');
					expect(user).toHaveProperty('id');
					expect(user).toHaveProperty('name');
					expect(user).toHaveProperty('surname');
					expect(user).toHaveProperty('email');
					expect(user).toHaveProperty('password');
					//Keys types
					expect(typeof user.id).toEqual('number');
					expect(typeof user.name).toEqual('string');
					expect(typeof user.surname).toEqual('string');
					expect(typeof user.email).toEqual('string');
					expect(typeof user.password).toEqual('string');
					//For testing
					if(user.id > 6)
						addedIDs.push(user.id);
				});
				//PROBLEMA CON ID
				exampleUser5.id = addedIDs[0];
				expect(getResponseJson).toContainEqual(exampleUser5);
				exampleUser6.id = addedIDs[1];
				expect(getResponseJson).toContainEqual(exampleUser6);
			});
	});

	describe('--> To test the empty list', () => {
		test('GET users response body if there are no users inside the table', () => {
			return getUsersList()
				.then(getResponse => {return getResponse.json()})
				.then(getResponseJson => {
					let tmpLength = getResponseJson.length;
					for(let i = 0; i < tmpLength; i++){
						if(getResponseJson[0].id < 9){
							getResponseJson.splice(0,1);
						}
					}
					expect(getResponseJson).toEqual([]);
				});
		});
	});

});

//PUT USER
//#########################

describe('PUT USER TESTS', () => {

	test('PUT user with less than two parameters', () => {
		return updateUserDB(exampleUserID)
			.then(putResponse => {expect(putResponse).toBeNull()});
	});

	test('PUT user with more than two parameters', () => {
		return updateUserDB(exampleUserID,putUser,putUser)
			.then(putResponse => {expect(putResponse).toBeNull()});
	});

	test('PUT user with first parameter null', () => {
		return updateUserDB(null, putUser)
			.then(putResponse => {expect(putResponse).toBeNull()});
	});

	test('PUT user with second parameter null', () => {
		return updateUserDB(exampleUserID, null)
			.then(putResponse => {expect(putResponse).toBeNull()});
	});

	test('PUT user with wrong id', () => {
		return updateUser(0, putUser)
			.then(putResponse => {expect(putResponse.status).toBe(400)});
	});

	test('PUT user with null name', () => {
		return updateUser(exampleUserID, wrongUser)
			.then(putResponse => {expect(putResponse.status).toBe(409)});
	});

	test('PUT user with null surname', () => {
		return updateUser(exampleUserID, wrongUser2)
			.then(putResponse => {expect(putResponse.status).toBe(409)});
	});

	test('PUT user with null email', () => {
		return updateUser(exampleUserID, wrongUser3)
			.then(putResponse => {expect(putResponse.status).toBe(409)});
	});

	test('PUT user with null password', () => {
		return updateUser(exampleUserID, wrongUser4)
			.then(putResponse => {expect(putResponse.status).toBe(409)});
	});

	test('PUT user response status and body correct', () => {
		let returnedID;
		return postUser(exampleUser7)
			.then(postResponse => {return postResponse.json()})
			.then(json => {return getUser(json.id)})
			.then(getResponse => {return getResponse.json()})
			.then(gRjson => {
				returnedID = gRjson.id;
				return updateUser(gRjson.id, putUser)
			})
			.then(putResponse => {
				expect(putResponse.status).toBe(200);
				return putResponse.json()})
			.then(putJson => {return getUserByID(putJson.id)})
			.then(putResponseJSON => {
				//Object schema
				expect(typeof putResponseJSON).toEqual('object');
				expect(putResponseJSON).toHaveProperty('id');
				expect(putResponseJSON).toHaveProperty('name');
				expect(putResponseJSON).toHaveProperty('surname');
				expect(putResponseJSON).toHaveProperty('email');
				expect(putResponseJSON).toHaveProperty('password');
				//Keys types
				expect(typeof putResponseJSON.id).toEqual('number')
				expect(typeof putResponseJSON.name).toEqual('string');
				expect(typeof putResponseJSON.surname).toEqual('string');
				expect(typeof putResponseJSON.email).toEqual('string');
				expect(typeof putResponseJSON.password).toEqual('string');
				//Object values
				expect(putResponseJSON).toEqual({
					'id': returnedID,
					'name': 'Four',
					'surname': 'Time',
					'email': 'four.time@gmail.com',
					'password': 'abba'
				});
			});
	});
});

test('GET list of exams of a valid user id',()=>{
	return getExams(validexam.creator)
	.then(res=>{return res.json();})
	.then(jres => {
		var dim = Object.keys(jres).length;
		for(var i=0;i<dim;i++){
			expect(typeof jres[i]).toEqual('object');
			expect(jres[i]).toHaveProperty('id');
			expect(jres[i]).toHaveProperty('creator');
			expect(jres[i]).toHaveProperty('deadline');
			expect(jres[i]).toHaveProperty('mark');

			expect(typeof jres[i].id).toEqual('number');
			expect(typeof jres[i].creator).toEqual('number');
			expect(typeof jres[i].deadline).toEqual('number');
			expect(typeof jres[i].mark).toEqual('number');

		}
	})
});

test('GET list of tasks of a valid user id',()=>{
	return getTasks(validtask.creator)
	.then(res=>{return res.json();})
	.then(jres=>{
		var dim = Object.keys(jres).length;
		for(var i=0;i<dim;i++) {
			expect(jres[i]).toHaveProperty('id');
			expect(jres[i]).toHaveProperty('creator');
			expect(jres[i]).toHaveProperty('task_type');
			expect(jres[i]).toHaveProperty('question');
			expect(jres[i]).toHaveProperty('mark');
			expect(jres[i]).toHaveProperty('mark');

			expect(typeof jres[i].id).toEqual('number')
			expect(typeof jres[i].creator).toEqual('number')
			expect(typeof jres[i].task_type).toEqual('number')
			expect(typeof jres[i].question).toEqual('string')
			expect(typeof jres[i].mark).toEqual('number')
		}
	})
});

test('GET list of exams of a not valid user id',()=>{
	return getExams(16)
	.then(res =>{return res.json()})
	.then(jres =>{
		expect(jres).toEqual({});
	})
});

test('GET list of tasks of a not valid user id',()=>{
	return getTasks(16)
	.then(res =>{return res.json()})
	.then(jres =>{
	  expect(jres).toEqual({});
  })
});

//LOGIN USER
//#########################

describe('LOGIN USER', () => {

	test('LOGIN user with less than 2 parameters', () => {
		return logUserFun(exampleUser.email)
			.then(logResponse => {expect(logResponse).toBeNull()});
	});

	test('LOGIN user with more than 2 parameters', () => {
		return logUserFun(exampleUser.email, exampleUser.password, exampleUser.password)
			.then(logResponse => {expect(logResponse).toBeNull()});
	});

	test('LOGIN user with first parameter null', () => {
		return logUserFun(null, exampleUser.password)
			.then(logResponse => {expect(logResponse).toBeNull()});
	});

	test('LOGIN user with second parameter null', () => {
		return logUserFun(exampleUser.email, null)
			.then(logResponse => {expect(logResponse).toBeNull()});
	});

	test('LOGIN user with invalid email', () => {
		return logUser(invalidEmail, exampleUser.password)
			.then(logResponse => {expect(logResponse.status).toBe(400)});
	});

	test('LOGIN user with invalid password', () => {
		return logUser(exampleUser.email, invalidPwd)
			.then(logResponse => {expect(logResponse.status).toBe(400)});
	});

	test('LOGIN user correct', () => {
		let returnedID;
		return logUser(exampleUser.email, exampleUser.password)
			.then(logResponse => {
				expect(logResponse.status).toBe(200);
				return logResponse.json();
			})
			.then(logJson => {
				returnedID = logJson.id;
				return getUserByID(logJson.id);
			})
			.then(getJson => {
				//Object schema
				expect(typeof getJson).toEqual('object');
				expect(getJson).toHaveProperty('id');
				expect(getJson).toHaveProperty('name');
				expect(getJson).toHaveProperty('surname');
				expect(getJson).toHaveProperty('email');
				expect(getJson).toHaveProperty('password');
				//Keys types
				expect(typeof getJson.id).toEqual('number')
				expect(typeof getJson.name).toEqual('string');
				expect(typeof getJson.surname).toEqual('string');
				expect(typeof getJson.email).toEqual('string');
				expect(typeof getJson.password).toEqual('string');
				//Object values
				expect(getJson).toEqual({
					'id': returnedID,
					'name': exampleUser.name,
					'surname': exampleUser.surname,
					'email': exampleUser.email,
					'password': exampleUser.password
				});
			});
	});

});

test('GET list of reviews of a valid user id',()=>{
	return getReviews(1)
	.then(res=>{return res.json();})
	.then(jres=>{
		var dim = Object.keys(jres).length;
		for(var i=0;i<dim;i++) {
			expect(jres[i]).toHaveProperty('id');
			expect(jres[i]).toHaveProperty('reviewer');
			expect(jres[i]).toHaveProperty('submission');
			expect(jres[i]).toHaveProperty('review_answer');
			expect(jres[i]).toHaveProperty('deadline');

			expect(typeof jres[i].id).toEqual('number')
			expect(typeof jres[i].reviewer).toEqual('number')
			expect(typeof jres[i].submission).toEqual('number')
			expect(typeof jres[i].review_answer).toEqual('string')
			expect(typeof jres[i].deadline).toEqual('number')
		}
	})
});

test('GET list of reviews of a not valid user id',()=>{
return getReviews(16)
.then(res =>{return res.json()})
	.then(jres =>{
		expect(jres).toEqual({});
	})
});

test('GET list of submissions of a valid user id',()=>{
	return getSubmissions(1)
	.then(res=>{return res.json();})
	.then(jres=>{
		var dim = Object.keys(jres).length;
		for(var i=0;i<dim;i++) {
      console.log(jres)
			expect(jres[i]).toHaveProperty('id');
			expect(jres[i]).toHaveProperty('user');
      expect(jres[i]).toHaveProperty('task');
			expect(jres[i]).toHaveProperty('exam');
			expect(jres[i]).toHaveProperty('answer');
			expect(jres[i]).toHaveProperty('final_mark');

			expect(typeof jres[i].id).toEqual('number')
			expect(typeof jres[i].user).toEqual('number')
			expect(typeof jres[i].exam).toEqual('number')
      expect(typeof jres[i].task).toEqual('number')
			expect(typeof jres[i].answer).toEqual('string')
      console.log("FINAL MARK: " + jres[i].final_mark);
			expect(typeof jres[i].final_mark).toEqual('number')
		}
	})
});

test('GET list of submissions of a not valid user id',()=>{
return getSubmissions(16)
.then(res =>{return res.json()})
	.then(jres =>{
		expect(jres).toEqual({});
	})
});
