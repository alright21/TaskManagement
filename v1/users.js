const express = require('express');
const bodyParser = require('body-parser');
const users = express.Router();



async function getfromdb(id){
    var queryText = 'SELECT * FROM "tasks" WHERE id==$1';
    var queryParams = [id];
    //var result = await pool.query(queryText, queryParams);
    var result=1;
    if(result==id){
      return {
        id: 1
       };
    }else {
      return null;
    }
  
}

users.use(bodyParser.json());
users.get('/', (req, res) => res.status(200).send('Hello World!'));

users.get('/:id/tasks', async(req,res)=> {

console.log(""+req.params.id);
res.status(200).send(""+req.params.id)
  //var result=await getfromdb(req.params.id);
  var result=null;
  /*if(result){
         var resultJson = JSON.parse(JSON.stringify(result));
         res.status(200).send(resultJson);
     }
     else{
         res.status(404).end();
     }*/
  });



module.exports ={
  users: users,
  getfromdb: getfromdb
}
