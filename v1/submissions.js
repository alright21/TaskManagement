const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const submissions = express.Router();

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'taskmanagement',
    password: 'root',
    port: '5432'
})

submissions.use(bodyParser.json());
submissions.get('/', (req, res) => res.status(200).send('Hello World!'));


submissions.post('/',(req, res) =>{

    console.log('post');
    console.log(req.body);
    // var result = await insertSubmissionIntoDatabse(req.body);
    // var submission = req.body;
    var queryText = 'INSERT INTO "submission" ("user","task","exam", "answer") VALUES($1,$2,$3,$4) RETURNING *';
    var queryParams = [req.body.user, req.body.task, req.body.exam, req.body.answer]; 
    

        pool.query(queryText, queryParams, (err, result) =>{

            if(err){
                console.log(err.stack);
                // return null;
            }else{
                var resultJson = JSON.parse(JSON.stringify(result.rows[0]));
                res.status(201).send(resultJson);
            }
            
        });
    // console.log(result)
    // if(result){
    //     console.log('entro if');
    //     var resultJson = JSON.parse(JSON.stringify(result));
    //     res.status(201).send(resultJson);
    // }
    // else{
    //     res.status(400).end();
    // }
    
    
});


function insertSubmissionIntoDatabse(submission){

    
    



}
module.exports = submissions;