var fetch = require ('node-fetch');
const bodyParser = require('body-parser');
const exams = require('../v1/exams');
const getfromdb = require('../v1/exams').getfromdb;

const root = process.env.SERVER_URL || 'http://localhost:3000'
const user_root = root+ '/v1/users';

const exams_root = user_root+'/1/exams';


var valid=1;
var invalid=-1;

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
    });
});


test('get/id/exams',()=>{

    return getfromdb(valid)
    .then(res=>{
      expect(res.id).toBe(valid)
  })
});

test('get invalid ',()=>{

    return getfromdb(invalid)
    .then(res=>{
      expect(res).toBeNull();
  })
});
