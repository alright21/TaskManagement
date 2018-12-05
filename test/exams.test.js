const fetch = require ('node-fetch');
const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = 'http://localhost:' + PORT + '/v1/exams';
const exams = require('../v1/exams').exams;
const insertExamIntoDatabase = require('../v1/exams').insertExamIntoDatabase;
const getExamById = require('../v1/exams').getExamById;


/* Those objects/variables are used for test cases */

const validExam = {
  "creator": 1,
  "deadline": 500,
  "mark": 30,
  "task_list": [1, 2]
};

const invalidExamCreator = {
  "creator": 0, // non esiste l'utente numero 0
  "deadline": 500,
  "mark": 30,
  "task_list": [1, 2]
};

const invalidTaskList = {
  "creator": 1,
  "deadline": 500,
  "mark": 30,
  "task_list": [1, 2, 0] // non esiste la task numero 0
};

const validUpdatedExam = {
  "deadline": 800,
  "mark": 25,
  "task_list": [1]
}


const invalidUpdatedExam = {
  "deadline": 0,
  "mark" : 50,
  "task_list": [10000] // non esiste la task numero 10000
}

const zeroId = 0;
const validId = 1;
const invalidId = 10000;

/* HELPER FUNCTIONS: API CALLS */
  
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

function getExam(id){
  return fetch(SERVER_URL + '/' + id,{
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
}

function updateExam(id, updatedExam){
  return fetch(SERVER_URL + '/' + id,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(updatedExam)
  })
}

// Test for API POST/exams

test('If the exam is succesful created, the API shoul return 201 with the json. The returned json should be the same of sent one, plus exam\'s id', ()=>{
  expect.assertions(5);
  return createExam(validExam)
    .then(response => {
      expect(response.status).toBe(201);
      return response.json();
    })
    .then(jsonRes => {
      return getExamById(jsonRes.id);
    })
    .then(exam => {
      expect(exam.creator).toEqual(validExam.creator);
      expect(exam.deadline).toEqual(validExam.deadline);
      expect(exam.mark).toEqual(validExam.mark);
      expect(exam.task_list).toEqual(validExam.task_list);
    })
});

test('If exam\'s creator does not exist, the API should return 400', ()=> {
  expect.assertions(1);
  return createExam(invalidExamCreator)
  .then(response => {
    expect(response.status).toBe(400);
  })
});

test('If one task does not exist, the API should return 400', ()=> {
  expect.assertions(1);
  return createExam(invalidTaskList)
  .then(response =>{
    expect(response.status).toBe(400);
  })
});

// Test for logic funcion inside API POST/exams calls

test('Valid exam is successful created and inserted into db', ()=>{
  expect.assertions(1);
  return insertExamIntoDatabase(validExam)
  .then(exam =>{
    return getExamById(exam.id)
  })
  .then(res =>{
    validExam.id = res.id;
    expect(res).toEqual(validExam);
  })
});

test('Invalid exam can\'t shouldn\'t be atted to database. Case: invalid creator id', ()=>{
  return insertExamIntoDatabase(invalidExamCreator)
  .then(exam =>{
    expect(exam).toBeNull();
  })
});

test('Invalid exam can\'t shouldn\'t be added to database. Case: invalid task list', ()=>{
  expect.assertions(1);
  return insertExamIntoDatabase(invalidTaskList)
  .then(exam =>{
    expect(exam).toBeNull();
  })
});

// Test for API GET/exams/{id}

/*
  Il database viene inizializzato con due esami con queste proprietà: 
    "creator": 1,
    "deadline": 500,
    "mark": 30,
    "task_list": [1, 2]
  Mi aspetto che l'esame numero 1 sia uguale all'esame validExam, di default uguale a quello creato durante il popolamento del database
*/
test('Test if valid exam id return the selected exam', ()=>{
  expect.assertions(8);
  return getExam(validId)
    .then(response => {
      expect(response.status).toBe(200);
      return response.json();
    })
    .then(jsonRes => {
      expect(jsonRes).toHaveProperty('id');
      expect(jsonRes).toHaveProperty('creator');
      expect(jsonRes).toHaveProperty('deadline');
      expect(jsonRes).toHaveProperty('mark');
      expect(jsonRes).toHaveProperty('task_list');
      expect(jsonRes.id).toEqual(validId);
      validExam.id = jsonRes.id;
      expect(jsonRes).toMatchObject(validExam);
    })
});

test('test if invalid exam id return 404 not found', ()=>{
  expect.assertions(1);
  return getExam(invalidId)
    .then(response =>{
      expect(response.status).toBe(404);
    })
});

// Test for API PUT/exams/{id}

test('Update valid exam should return 201 and the json with updated exam', () =>{
  expect.assertions(9 + validUpdatedExam.task_list.length);
  return updateExam(validId, validUpdatedExam)
    .then(response =>{
      expect(response.status).toBe(204);
      return getExam(validId);
    })
		.then(res => {
			expect(res.status).toBe(200);
      return res.json();
    })
    .then(jsonRes => {
      expect(jsonRes).toHaveProperty('id');
      expect(jsonRes).toHaveProperty('creator');
      expect(jsonRes).toHaveProperty('deadline');
      expect(jsonRes).toHaveProperty('mark');
      expect(jsonRes).toHaveProperty('task_list');
      expect(jsonRes.id).toEqual(validId);
      // l'id di un esame non può essere modificato, per cui assegno all'oggetto validUpdateExam l'id dell'oggetto appena ritornato
      validUpdatedExam.id = jsonRes.id;
      // l'id del creatore di un esame non può essere modificato, per cui assegno all'oggeto validUpdateExam l'id dell'oggetto appena ritornato
      validUpdatedExam.creator = jsonRes.creator;
      /* 
        potrei aver passato al put un esame con una nuova task dentro task_list, ma senza passare anche l'intera lista delle task che fanno già
        parte di quell'esame, quindi controllo se le nuove task sono state aggiunte. poi assegno per fare toMatchObject
      */
      for (var i = 0; i < validUpdatedExam.task_list.length; i++){
        expect(jsonRes.task_list).toContain(validUpdatedExam.task_list[i]);
      }
      validUpdatedExam.task_list = jsonRes.task_list;
      expect(jsonRes).toMatchObject(validUpdatedExam);
    })
})

test('Update exam with id 0 should return 404', ()=>{
  expect.assertions(1);
  return updateExam(zeroId, validUpdatedExam)
    .then(response =>{
      expect(response.status).toBe(404);
    })
})

test('Update exam with invalid id should return 404', ()=>{
  expect.assertions(1);
  return updateExam(invalidId, validUpdatedExam)
    .then(response =>{
      expect(response.status).toBe(404);
    })
})

test('Update exam with invalid task id should return 404', ()=>{
  expect.assertions(1);
  return updateExam(validId, invalidUpdatedExam)
    .then(response =>{
      expect(response.status).toBe(404);
    })
})