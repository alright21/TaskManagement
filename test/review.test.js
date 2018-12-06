const fetch = require ('node-fetch');
const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = 'http://localhost:' + PORT + '/v1/review';
const review = require('../v1/review').review;
const getReviewById = require('../v1/review').getReviewById;
const updateReviewInDatabase = require('../v1/review').updateReviewInDatabase;

//Objects used for testing:

const validReview = {
	'id': 1,
	'reviewer': 1,
	'submission': 1,
	'review_answer': 'This is a review answer.',
	'deadline': 200
};

const modifiedReview = {
	'id': 1,
	'reviewer': 1,
	'submission': 1,
	'review_answer': 'This is a review answer modified!',
	'deadline': 200
};

const invalidRewiever = {
	'id': 1,
	'reviewer': 180,
	'submission': 1,
	'review_answer': 5,
	'deadline': 200	
};

const invalidSubmission = {
	'id': 1,
	'reviewer': 1,
	'submission': 15,
	'review_answer': 5,
	'deadline': 200	
};

const invalidDeadline = {
	'id': 1,
	'reviewer': 1,
	'submission': 1,
	'review_answer': 5,
	'deadline': 0	
};

// Helper functions: API calls

function getReview(id){
  return fetch(SERVER_URL + '/' + id,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

function updateReview(id,toModify){
  return fetch(SERVER_URL + '/' + id,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(toModify)
  });
}

//Test case for PUT api

test('testing a valid update', () => {
  return updateReview(validReview.id, validReview)
  .then(res => {
    expect(res.status).toBe(201);
    return res.json();
  }).then(resJson =>{
    return getReviewById(resJson.id);
  }).then(modRewiew =>{
      expect(modRewiew).toHaveProperty('id');
      expect(modRewiew).toHaveProperty('reviewer');
      expect(modRewiew).toHaveProperty('submission');
      expect(modRewiew).toHaveProperty('review_answer');
      expect(modRewiew).toHaveProperty('deadline')
  });
});

// Not modificable fields
test('if someone tries to modify the reviewer, should return 409', () => {
  return updateReview(validReview.id, invalidRewiever)
  .then(res => {
    expect(res.status).toBe(409);
  });
});

test('if someone tries to modify the submission1, should return 409', () => {
  return updateReview(validReview.id, invalidSubmission)
  .then(res => {
    expect(res.status).toBe(409);
  });
});

test('if someone tries to modify the deadline, should return 409', () => {
  return updateReview(validReview.id, invalidDeadline)
  .then(res => {
    expect(res.status).toBe(409);
  });
});

test('if you modify the review_answer of the review, should get the same review updated', ()=>{

  return updateReviewInDatabase(validReview.id, modifiedReview)
  .then(updated =>{
    return getReviewById(updated.id)
    .then(res =>{
      expect(res.id).toEqual(validReview.id);
      expect(res.reviewer).toEqual(validReview.reviewer);
      expect(res.submission).toEqual(validReview.submission);
      expect(res.review_answer).toEqual(modifiedReview.review_answer);
      expect(res.deadline).toEqual(validReview.deadline)
    });
  });
});