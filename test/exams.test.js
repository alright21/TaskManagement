const fetch = require ('node-fetch');
const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = 'http://localhost:' + PORT + '/v1/exams';
const exams = require('../v1/exams').exams;
const insertExamIntoDatabase = require('../v1/exams').insertExamIntoDatabase;
const getExamById = require('../v1/exams').getExamById;

const validExam = {
  "creator": 1,
  "deadline": 500,
  "mark": 30,
  "task_list": [1, 2]
};

const invalidExamCreator = {
  "creator": 0,
  "deadline": 500,
  "mark": 30,
  "task_list": [1, 2]
};

const invalidTaskList = {
  "creator": 1,
  "deadline": 500,
  "mark": 30,
  "task_list": [1, 2, 3]
};
  
function createExam(exampleExam){
  return fetch(SERVER_URL,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(exampleExam)
  })
}

// TEST

var server;
beforeAll(function () {
  server = require('../index');
});
afterAll(function () {
  server.close();
});

// Test for API

test('if the exam is succesful created, the API shoul return 201 with the json. The returned json should be the same of sent one, plus exam\'s id', ()=>{

  return createExam(validExam)
    .then(response => {
      expect(response.status).toBe(201);
      return response.json();
    })
    .then(jsonRes => {
      expect(jsonRes.creator).toEqual(validExam.creator);
      expect(jsonRes.deadline).toEqual(validExam.deadline);
      expect(jsonRes.mark).toEqual(validExam.mark);
      expect(jsonRes.task_list).toEqual(validExam.task_list);
    })
});

test('if exam\'s creator does not exist, the API should return 400', ()=> {
  return createExam(invalidExamCreator)
  .then(response => {
    expect(response.status).toBe(400);
  })
});

test('if one task does not exist, the API should return 400', ()=> {
  return createExam(invalidTaskList)
  .then(response =>{
    expect(response.status).toBe(400);
  })
});

// Test for logic funcion inside API calls

test('valid exam is successful created and inserted into db', ()=>{
  return insertExamIntoDatabase(validExam)
  .then(exam =>{
    console.log(exam);
    return getExamById(exam.id)
    .then(res =>{
      validExam.id = res.id;
      expect(res).toEqual(validExam);
    })
  })
});

test('wrong exam can\'t shouldn\'t be atted to database. Case: invalid creator id', ()=>{
  return insertExamIntoDatabase(invalidExamCreator)
  .then(exam =>{
    expect(exam).toBeNull();
  })
});

test('wrong exam can\'t shouldn\'t be atted to database. Case: invalid task list', ()=>{
  return insertExamIntoDatabase(invalidTaskList)
  .then(exam =>{
    expect(exam).toBeNull();
  })
});