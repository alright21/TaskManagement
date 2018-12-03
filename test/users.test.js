const fetch = require ('node-fetch');
const root = 'http://localhost:3000';
var server;


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
  creator: 1,
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

test('get valid task, 200',()=>{
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
test('get invalid exam, NULL',()=>{
  return getExams(16)
  .then(res =>{return res.json()})
    .then(jres =>{
      expect(jres).toEqual({});
    })
});


test('get invalid task, NULL',()=>{
  return getTasks(16)
  .then(res =>{return res.json()})
    .then(jres =>{
      expect(jres).toEqual({});
    })
});
