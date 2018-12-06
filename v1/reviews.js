const express = require('express');
const bodyParser = require('body-parser');
const review = express.Router();
const pg = require('pg');

const config = require('../db_config');
const pool = new pg.Pool(config);

review.use(bodyParser.json());

review.get('/', (req, res) => res.status(200).send('Hello World!'));

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

async function updateReviewInDatabase(id){

    id = Number.parseInt(id);
    console.log('id in updateReviewInDatabase: '+id);
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
                return null;
			}
			if (toModify.submission != reviews.submission )
			{
				return null;
			}
			if (toModify.deadline != submission.deadline)
			{
				return null;
			}
            else 
            {
	            var queryText = 'UPDATE "reviews" SET "reviewer_answer"=$1 WHERE "id"=$2 RETURNING *';
	            var queryParams = [toModify.reviewer_answer, id];
	            //Cerco la submission corrispondente a quella review tramite submission 
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
        // select review from table "class"
        let queryText = 'SELECT * FROM "reviews" WHERE id=$1';
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