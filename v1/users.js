const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const users = express.Router();


const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'taskmanagement',
    password: 'root',
    port: '5432'
});

users.use(bodyParser.json());
users.get('/', (req, res) => res.status(200).send('Hello World!'));


users.get('/:id/tasks',(req,res)=> {
      res.status(200).send("Hello "+req.params.id/*query per il database*/);
});

users.get('/:id/exams', async(req,res)=> {
  console.log(""+req.params.id);
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


//GET EXAMS FROM DB WHERE CREATOR==ID

async function getexams(id){
  if(!id){
  return null;
    }
    else{
      let queryText = 'SELECT * FROM "exams" WHERE creator==$1';
      let queryParams = [id];
      let result = await pool.query(queryText, queryParams);
      let exams;
      if(result.rowCount!=0){
        exams = JSON.parse(JSON.stringify(result));
      }else {
        return null;
      }
    }
}

module.exports = {
  users: users,
  getexams: getexams
};
