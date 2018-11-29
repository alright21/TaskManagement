var fetch = require ('node-fetch');
const bodyParser = require('body-parser');
const gettasks = require('../v1/users').gettasks;
const users = require('../v1/users');

const root = process.env.SERVER_URL || 'http://localhost:3000'
const user_root = root+ '/v1/users';

const id_tasks = user_root+'/3/tasks';


var valid={
  id: 1,
  creator: 2,
  task_type: 2,
  question: "quanto è bello ciccio?"",
  example: "tanto bello",
  mark: 30,
  }
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


test('get/id/tasks',()=>{
    return gettasks(valid)
    .then(res=>{
      expect(res.id).toBe(valid)
  })
});

test('get invalid ',()=>{

    return gettasks(invalid)
    .then(res=>{
      expect(res).toBeNull();
  })
});
