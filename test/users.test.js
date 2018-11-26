var fetch = require ('node-fetch');


const root = process.env.SERVER_URL || 'http://localhost:3000'
const user_root = root+ '/v1/users';

const id_tasks = user_root+'/3/tasks';

var server;
function getTest(){
  return fetch(user_root,{
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
}

function getidtest(){
  return fetch(id_tasks,{
    method: 'GET',
    headers: {
      'Accept':'application/json'
    }
  });
}

beforeAll(function () {
  server = require('../index');
});
afterAll(function(){
server.close();
});
/*
beforeEach(function(){
  server= require('../index');
});
afterEach(function () {
  server.close();
});*/

test('prova', ()=>{

  return getTest()
    .then(res => {
      expect(res.status).toBe(200);
    });
});

test('acsadfasd',()=>{

    return getidtest()
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
