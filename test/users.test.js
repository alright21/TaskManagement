var fetch = require ('node-fetch');
const bodyParser = require('body-parser');
const exams = require('../v1/exams');
const getfromdb = require('../v1/users').getfromdb;
const root = process.env.SERVER_URL || 'http://localhost:3000'
const user_root = root+ '/v1/users';

const exams_root = user_root+'/1/exams';


var valid={
  id: 15,
  creator:1,
  deadline: 200,
  mark: 30,
};

var invalid={
  id: -1,
  creator:1,
  deadline: 200,
  mark: 30,
};

function getTest(){
  return fetch(user_root,{
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
}


beforeAll(function () {
  server = require('../index');
});
afterAll(function(){
server.close();
});


test('get', ()=>{
  return getTest()
    .then(res => {
      expect(res.status).toBe(200);
    })
});


test('get/users/id/exams',()=>{
    return getfromdb(valid.id)
    .then(res=>{
      expect(res).toBe(200);
      return res.json();
    })
    .then(jres => {
      expect(jres.id).toEqual(valid)
    })
});

test('get invalid ',()=>{
    return getfromdb(invalid)
    .then(res=>{
      expect(res).toBeNull();
  })
});
