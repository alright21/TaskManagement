const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const submissions = express.Router();

const config = require('../db_config');
const pool = new pg.Pool(config);

submissions.use(bodyParser.json());
submissions.get('/', (req, res) => res.status(200).send('Hello World!'));


submissions.post('/',async (req, res) =>{

    // console.log('post');
    // console.log(req.body);
    var result = await insertSubmissionIntoDatabase(req.body);
    // var submission = req.body;
    
    // console.log(result);
    if(result){
        // console.log('entro if');
        var resultJson = JSON.parse(JSON.stringify(result));
        res.status(201).send(resultJson);
    }
    else{
        res.status(400).end();
    }
    
    
});

submissions.put('/:id', async (req, res)=>{

    const id = req.params.id;
    const toModify = req.body;
    if(!id){
        res.status(400).end();
    }


    var result = await updateSubmissionInDatabase(id, toModify);

    if(result){
        var resultJson = JSON.parse(JSON.stringify(result));
        //await console.log(resultJson + '\n\n\n\n');
        res.status(201).send(resultJson);
    }else{
        res.status(409).end();
    }
})


async function insertSubmissionIntoDatabase (submission){

    //Qui ci andrà la logica per controllare che user, task e exam esistano per evitare problemi di database
    var isUser = await getUserById(submission.user);
    var isTask = await getTaskById(submission.task);
    var isExam = await getExamById(submission.exam);
    // var isUser = null;
    // var isTask = null;
    // var isExam = null;
    // console.log("isUser: " + isUser + ", isTask: " + isTask + ", isExam: " + isExam);
    
    if(!isUser || !isExam || !isTask){
        // console.log("Null values");
        return null;
    }else{

        var queryText = 'INSERT INTO "submission" ("user","task","exam", "answer") VALUES($1,$2,$3,$4) RETURNING *';
        var queryParams = [submission.user, submission.task, submission.exam, submission.answer]; 
        
        // console.log(submission);
        var result = await pool.query(queryText, queryParams);
        if(result){
            return result.rows[0];
        }else{
            return null;
        }
    }
    
    
    
}

async function getSubmissionById(id){

    if(!id){
        return null;
    }else{

        var queryText = 'SELECT * FROM "submission" WHERE id=$1';
        var queryParams = [id];
        var result = await pool.query(queryText, queryParams);
        // console.log("result rows: " + Object.getOwnPropertyNames(result.rows[0]).length);
        // for (const i of result.rows) console.log(i)
        if(result.rowCount != 0){
            // console.log("result rows: " + result.rows[0]);
            return result.rows[0];
        }else{
            return null;
        }

    }
}

async function getUserById(id){

    if(!id){
        return null;
    }else{

        var queryText = 'SELECT * FROM "user" WHERE id=$1';
        var queryParams = [id];
        var result = await pool.query(queryText, queryParams);
        // console.log("result rows: " + Object.getOwnPropertyNames(result.rows[0]).length);
        // for (const i of result.rows) console.log(i)
        if(result.rowCount != 0){
            return result.rows[0];
        }else{
            return null;
        }

    }
}


async function getTaskById(id){

    if(!id){
        return null;
    }else{

        var queryText = 'SELECT * FROM "task" WHERE id=$1';
        var queryParams = [id];
        var result = await pool.query(queryText, queryParams);
        // console.log("result rows: " + Object.getOwnPropertyNames(result.rows[0]).length);
        // for (const i of result.rows) console.log(i)
        if(result.rowCount != 0){
            return result.rows[0];
        }else{
            return null;
        }

    }
}

async function getExamById(id){

    if(!id){
        return null;
    }else{

        var queryText = 'SELECT * FROM "exam" WHERE id=$1';
        var queryParams = [id];
        var result = await pool.query(queryText, queryParams);
        // console.log("result rows: " +Object.getOwnPropertyNames(result.rows[0]).length);
        // for (const i of result.rows) console.log(i)
        if(result.rowCount != 0){
            return result.rows[0];
        }else{
            return null;
        }

    }
}





async function updateSubmissionInDatabase(id, toModify){

    if(!id){
        return null;
    }else{
        var isSubmission = await getSubmissionById(id);

        if(!isSubmission){
            return null;
        }else{
            if(isSubmission.user != toModify.user){
                return null;
            }
            else if(isSubmission.task != toModify.task){
                return null;
            }
            else if(isSubmission.exam != toModify.exam){
                return null;
            }else{
                console.log(id);
                var queryText = 'UPDATE "submission" SET "answer"=$1,"final_mark"=$2 WHERE "id"=$3 RETURNING *';
                var queryParams = [toModify.answer,toModify.final_mark, id];

                var result = await pool.query(queryText,queryParams);

                //console.log(result);
                if(result.rowCount != 0){
                    return result.rows[0];
                }else{
                    return null;
                }

            }
        }
    }
}



module.exports = {
    submissions: submissions,
    insertSubmissionIntoDatabase: insertSubmissionIntoDatabase,
    getSubmissionById: getSubmissionById,
    updateSubmissionInDatabase: updateSubmissionInDatabase
}
