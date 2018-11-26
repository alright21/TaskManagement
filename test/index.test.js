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

beforeEach(function () {
  server = require('../index');
});
afterEach(function () {
  server.close();
});
test('prova', ()=>{

  return getTest()
    .then(res => {
      expect(res.status).toBe(200);
    });


});
