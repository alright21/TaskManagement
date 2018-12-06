const express = require('express');
const bodyParser = require('body-parser');
const review = express.Router();

const pg = require('pg');
const config = require('../db_config');
const pool = new pg.Pool(config);

review.use(bodyParser.json());

review.get('/', (req, res) => res.status(200).send('Hello World!'));

review.get('/:id', async (req, res) =>{

    const id = req.params.id;
    let results = await getReviewById(req.params.id);
    if(results)
    {
        var resultJson = JSON.parse(JSON.stringify(results));
        res.status(200).send(resultJson);
    }
    else
    {
        res.status(404).end();
    }
});

review.put('/:id', async (req, res) => {

    const id = req.params.id;
    const toModify = req.body;
    if(!id)
    {
        res.status(400).end();
    }
    var result = await updateReviewInDatabase(id, toModify);
    if(result)
    {
        var resultJson = JSON.parse(JSON.stringify(result));
        res.status(201).send(resultJson);
    }
    else
    {
        res.status(409).end();
    }
});

async function updateReviewInDatabase(id, toModify){

    id = Number.parseInt(id);
    if(!id && !toModify)
    {
        return null;
    }
    else
    {
        var isReview = await getReviewById(id);
        if(!isReview)
        {
            return null;
        }
        else
        {
        	//Not modificable fields:
        	if(isReview.reviewer != toModify.reviewer)
        	{
        		console.log('sono nel primo if');
                return null;
			}
			if (toModify.submission != isReview.submission )
			{
				console.log('sono nel secondo if');
				return null;
			}
			
			if (toModify.deadline != isReview.deadline)
			{
				console.log('sono nel terzo if');
				return null;
			}
            else 
            {
	            var queryText = 'UPDATE "review" SET "review_answer"=$1 WHERE "id"=$2 RETURNING *';
	            var queryParams = [toModify.review_answer, id]; 
	            var result = await pool.query(queryText,queryParams);
	            if(result.rowCount != 0)
	            {
	                return result.rows[0];
	            }
	            else
	            {
	                return null;
	            }
	        }
        }
    }
}

async function getReviewById(id){

	if(!id)
    {
        return null;
    }
    else
    {
        let queryText = 'SELECT * FROM "review" WHERE id=$1';
        let queryParams = [id];
        let result = await pool.query(queryText, queryParams);
		var review; 
		if(result.rowCount != 0)
        {
            review = JSON.parse(JSON.stringify(result.rows[0]));
        }
        else
        {
            return null;
        }
        return review;
    }
}

module.exports = {
    review: review,
    getReviewById: getReviewById,
    updateReviewInDatabase: updateReviewInDatabase
}