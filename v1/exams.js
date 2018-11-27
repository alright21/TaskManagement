const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const exams = express.Router();

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'taskmanagement',
    password: 'root',
    port: '5432'
})

exams.post('/', async (req, res) =>{
    let results = await insertExamIntoDatabase(req.body);
    
    if(results){
        var resultJson = JSON.parse(JSON.stringify(results));
        res.status(201).send(resultJson);
    }
    else{
        res.status(400).end();
    }
});

exams.get('/:id', async (req, res) =>{
    console.log(req.params.id);
    let results = await getExamById(req.params.id);
    console.log(results);
    if(results){
        var resultJson = JSON.parse(JSON.stringify(results));
        res.status(200).send(resultJson);
    }
    else{
        res.status(404).end();
    }
})

async function insertExamIntoDatabase(exam){
    // check creatorId exists into database
    let isUser = await getUserById(exam.creator);
    if(!isUser)
        return null;

    // check every tasks exist into database
    let tasklist = exam.task_list;
    for(i in tasklist){
        let isTask = await getTaskById(tasklist[i]);
        if(!isTask)
            return null;
    }

    // insert exam into database
    let queryText = 'INSERT INTO "exam" ("creator", "deadline", "mark") VALUES ($1, $2, $3) RETURNING *';
    let queryParam = [exam.creator, exam.deadline, exam.mark];

    let insertExam;
    let res = await pool.query(queryText, queryParam);
    if(res)
        insertExam = JSON.parse(JSON.stringify(res.rows[0]));
    else
        return null;


    // insert every task into database table "task in exams", creating a relation task-exam
    var tasklist2 = []; //this variable is used to store the tasks' ids added into db (we have yet these ids, but we add the ids returned by the queries)

    queryText = 'INSERT INTO "task_in_exams" ("task", "exam") VALUES ($1, $2) RETURNING task';
    for(i in tasklist){
        res = await pool.query(queryText, [tasklist[i], insertExam.id]);
        if(res){
            tasklist2.push(res.rows[0].task);
        }
    }

    // put a new param into the json called task_list
    insertExam.task_list = tasklist2;

    // return the exam with the id and the tasks list
    return insertExam;
}

async function getUserById(id){
    if(!id){
        return null;
    }else{
        const queryText = 'SELECT * FROM "user" WHERE id=$1';

        let queryParams = [id];
        let result = await pool.query(queryText, queryParams);
        
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
        const queryText = 'SELECT * FROM "task" WHERE id=$1';
        let queryParams = [id];
        let result = await pool.query(queryText, queryParams);

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
        // select exam from table "exam"
        let queryText = 'SELECT * FROM "exam" WHERE id=$1';
        let queryParams = [id];
        let result = await pool.query(queryText, queryParams);

        let exam;
        if(result.rowCount != 0){
            exam = JSON.parse(JSON.stringify(result.rows[0]));
        }else{
            return null;
        }

        // select task in that exam from table "task_in_exams"
        queryText = 'SELECT * FROM "task_in_exams" WHERE exam=$1';

        
        let tasklist = []; // this variable is used to store tasks which are in exam
        result = await pool.query(queryText, queryParams);
        if(result.rowCount != 0){
            for (var i = 0; i < result.rowCount; i++){
                tasklist.push(result.rows[i].task);
            }
        }

        // add the list of tasks to exam variable
        exam.task_list = tasklist;
        return exam;
    }
}

module.exports = {
    exams: exams,
    insertExamIntoDatabase: insertExamIntoDatabase,
    getExamById: getExamById
}