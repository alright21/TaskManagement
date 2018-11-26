const fetch = require ('node-fetch');
const root = 'http://localhost:3000';
var server;

const exampleUser = {
   'name': 'Mario',
   'surname': 'Rossi',
   'email': 'mario.rossi@gmail.com',
   'password': 'password'
};

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

//TESTS
test('Post user response', () => {
   return postUser(exampleUser)
      .then(postResponse => {expect(postResponse.status).toBe(201)});
});

test('Post user response body', () => {
   // expect.assertions(10);
   return postUser(exampleUser)
      .then(postResponse => {return postResponse.json()})
      .then(postResponseJson => {
         //Object schema
         expect(typeof postResponseJson).toEqual('object');
         expect(postResponseJson).toHaveProperty('name');
         expect(postResponseJson).toHaveProperty('surname');
         expect(postResponseJson).toHaveProperty('email');
         expect(postResponseJson).toHaveProperty('password');
         //Keys types
         expect(typeof postResponseJson.name).toEqual('string');
         expect(typeof postResponseJson.surname).toEqual('string');
         expect(typeof postResponseJson.email).toEqual('string');
         expect(typeof postResponseJson.password).toEqual('string');
         //Object values
         expect(postResponseJson).toMatchObject({
            // 'id': 'sidfh3h20',
            'name': 'Mario',
            'surname': 'Rossi',
            'email': 'mario.rossi@gmail.com',
            'password': 'password'
         });
      })
});

//Test of 2 posts in a row