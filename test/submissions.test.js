const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000;

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:' + PORT + '/v1/submissions';
 
var exampleSubmission = {
	"user": 2,
	"task": 2,
	"exam": 1,
	"answer": "This is my answer"
};

//helpers method using fetch
function createSubmission(newSubmission){
  return fetch(SERVER_URL,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newSubmission)
  })
}


//TEST cases

var server;
beforeAll(function () {
  server = require('../index');
});
afterAll(function () {
  server.close();
});


test('test the creation of a new Submission',() =>{
  // expect.assertions(1);
  return createSubmission(exampleSubmission)
  .then(response => {
    return response.json();
  })
  .then(jsonRes =>{
    expect(jsonRes.user).toEqual(exampleSubmission.user);
  })}
, 30000)

