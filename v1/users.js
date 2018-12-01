const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const users = express.Router();

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'travis_ci_test',
    password: 'root',
    port: '5432'
});

users.use(bodyParser.json());
users.get('/', (req, res) => res.status(200).send('Hello World!'));


users.get('/:id/exams', async(req,res)=> {
  res.status(200).send("ciao "+req.params.id);
  let result=await getexams(req.params.id);
  if(result){
       var resultJson = JSON.parse(JSON.stringify(result));
       res.status(200).send(resultJson);
   }
   else{
       res.status(404).end();
   }
});

users.get('/:id/tasks', async(req,res)=> {
console.log(req.params.id);
res.status(200).send("ciao "+req.params.id)
  var result=await gettasks(req.params.id);
  if(result){
         var resultJson = JSON.parse(JSON.stringify(result));
         res.status(200).send(resultJson);
     }
     else{
         res.status(404).end();
     }
  });

//GET TASKS FROM DB WHERE CREATOR==ID
async function gettasks(id){
  if(!id){
    return null;
  }else{
    let queryText = 'SELECT * FROM "task" WHERE creator==$1';
    let queryParams = [id];
    let result = await pool.query(queryText, queryParams);
    let tasks;
    if(result.rowCount!=0){
       tasks = JSON.parse(JSON.stringify(result));
    }else {
       return null;
    }
  }
  return tasks;
}
//GET EXAMS FROM DB WHERE CREATOR==ID
async function getexams(id){
  if(!id){
  return null;
    }
    else{
      let queryText = 'SELECT * FROM "exam" WHERE creator==$1';
      let queryParams = [id];
      let result = await pool.query(queryText, queryParams);
      let exams;
      if(result.rowCount!=0){
        exams = JSON.parse(JSON.stringify(result));
      }else {
        return null;
      }
    }
  return exams;
 }


module.exports ={
  users: users,
  gettasks : gettasks,
  getexams: getexams
}
