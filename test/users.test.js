const fetch = require ('node-fetch');
const root = 'http://localhost:3000';
var server;

const getTasks = require('../v1/users').getTasks;
const getExamById = require('../v1/users').getExams;

const exampleUser = {'name': 'Mario','surname': 'Rossi','email': 'mario.rossi@gmail.com','password': 'password'};
const exampleUser2 = {'name': 'Marione','surname': 'Razzi','email': 'marione.razzi@gmail.com','password': 'a'};
const exampleUser3 = {'name': 'Darione','surname': 'Rassi','email': 'darione.rassi@gmail.com','password': 'b'};
const exampleUser4 = {'name': 'One','surname': 'Time','email': 'one.time@gmail.com','password': 'c'};
const wrongUser = {'name': null,'surname': 'Time','email': 'one.time@gmail.com','password': 'c'};
const wrongUser2 = {'name': 'One','surname': null,'email': 'one.time@gmail.com','password': 'c'};
const wrongUser3 = {'name': 'One','surname': 'Time','email': null,'password': 'c'};
const wrongUser4 = {'name': 'One','surname': 'Time','email': 'one.time@gmail.com','password': null};
const wrongUser5 = {'name': 'One','surname': 'Time','email': 'one.time@gmail.com','password': 'azz'};
const exampleUserID = 1;

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
  creator: 2,
  deadline: 550,
  mark: 30
  };

var invalidid=-1;

beforeAll(function () {
   server = require('../index');
});
afterAll(function () {
   server.close();
});

//HELPER FUNCTIONS
const postUser = function(newUser){
   return fetch(root + '/v1/users', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
      },
      body: JSON.stringify(newUser)
   });
}

const getUser = function(userID){
	return fetch(root + '/v1/users/' + userID, {
		method: 'GET',
		headers: {
			'Accept': 'application/json'
		}
	});
}

//TESTS
//POST
test('Post user response', () => {
   return postUser(exampleUser4)
      .then(postResponse => {expect(postResponse.status).toBe(201)});
});

test('Post and get response', () => {
	return postUser(exampleUser)
		.then(postResponse => { return postResponse.json(); })
		.then(postResponseJson => {
			exampleUser.id = postResponseJson.id;
			return getUser(exampleUser.id);
		})
		.then(getResponse => {return getResponse.json();})
		.then(jsonResponse => {expect(jsonResponse).toEqual(exampleUser)});
});

test('Post user with wrong name', () => {
	return postUser(wrongUser)
		.then(postResponse => {expect(postResponse.status).toBe(400)});
});

test('Post user with wrong surname', () => {
	return postUser(wrongUser2)
		.then(postResponse => {expect(postResponse.status).toBe(400)});
});

test('Post user with wrong email', () => {
	return postUser(wrongUser3)
		.then(postResponse => {expect(postResponse.status).toBe(400)});
});


test('Post user with wrong password', () => {
	return postUser(wrongUser4)
		.then(postResponse => {expect(postResponse.status).toBe(400)});
});


test('Post user with email already in db', () => {
	return postUser(wrongUser5)
		.then(postResponse => {expect(postResponse.status).toBe(400)});
});

//GET
test('Get user response', () => {
	return getUser(exampleUserID)
		.then(getResponse => {expect(getResponse.status).toBe(200)});
});

test('Get user response if not found', () => {
	return getUser(0)
		.then(getResponse => {expect(getResponse.status).toBe(400)});
});

test('Get user response body if found', () => {
	return getUser(exampleUserID)
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
			expect(getResponseJson).toEqual({
					'id': 1,
					'name': 'francesco',
					'surname': 'da dalt',
					'email': 'francescodadalt@hotmail.it',
					'password': 'lol'
			});
	});
});

test('Get user response body if not found', () => {
	return getUser(0)
		.then(getResponse => {return getResponse.json()})
		.then(getResponseJson => {
			expect(getResponseJson).toEqual({});
		});
});

test('get valid exam, 200',()=>{
    return getExams(validexam.creator)
    .then(res=>{
      expect(res).toBe(200);
      return res.json();
    })
    .then(jres => {
      expect(jres.id).toEqual(validexam.id);
      expect(jres.creator).toEqual(validexam.creator);
      expect(jres.deadline).toEqual(validexam.deadline);
      expect(jres.mark).toEqual(validexam.mark);
    })
});

test('get valid task, 200',()=>{
    return getTasks(validtask.creator)
    .then(res=>{
      expect(res).toBe(200);
      return res.json();
    })
    .then(jres=>{
      expect(jres.id).toBe(validtask.id);
      expect(jres.creator).toBe(validtask.creator);
      expect(jres.task_type).toBe(validtask.task_type);
      expect(jres.question).toBe(validtask.question);
      expect(jres.mark).toBe(validtask.mark);

  })
});

test('get invalid exam, NULL',()=>{
    return getExams(invalidid)
    .then(res =>{
      expect(res).toBeNull();
    })
});

test('get invalid task, NULL',()=>{
    return getTasks(invalidid)
    .then(res=>{
      expect(res).toBeNull();
  })
});
