var request = require('supertest');
var fetch = require ('node-fetch');


  
function getTest(){

  return fetch('http://localhost:3000',{
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
}

beforeAll(function () {
  server = require('../index');
});
afterAll(function () {
  server.close();
});
test('prova', ()=>{

  return getTest()
    .then(res => {
      expect(res.status).toBe(200);
    });  
});