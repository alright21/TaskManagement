var fetch = require ('node-fetch');
const bodyParser = require('body-parser');
const users  = require('../v1/users');
const getexams = require('../v1/users').getexams;
const gettasks = require('../v1/users').gettasks;

const root = process.env.SERVER_URL || 'http://localhost:3000'
const user_root = root+ '/v1/users';

const exams_root = user_root+'/1/exams';


var validtask={
  id: 1,
  creator:1,
  deadline: 200,
  mark: 30,
};


var validexam={
  id: 1,
  creator: 2,
  task_type: 2,
  question: "quanto è bello ciccio?",
  example: "tanto bello",
  mark: 30,
  }

var invalidid=-1;

function getTest(){
  return fetch(user_root,{
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
}

var server;
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


test('get valid exam',()=>{
    return getexams(validexam.creator)
    .then(res=>{
      expect(res).toBe(200);
      return res.json();
    })
    .then(jres => {
      expect(jres.id).toEqual(validexam)
    })
});

test('get invalid exam',()=>{
    return getexams(invalidid)
    .then(res =>{
      expect(res).toBeNull();
    })
});

test('get valid task',()=>{
    return gettasks(validtask.creator)
    .then(res=>{
      expect(res.id).toBe(validtask)
  })
});

test('get invalid task',()=>{
    return gettasks(invalidid)
    .then(res=>{
      expect(res).toBeNull();
  })
});
