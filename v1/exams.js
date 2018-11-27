const express = require('express');
const bodyParser = require('body-parser');
const exams = express.Router();

exams.use(bodyParser.json());
exams.get('/', (req, res) => res.status(200).send('Hello World!'));


exams.get('/:id/exams', async(req,res)=> {

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



async function getfromdb(id){
    var queryText = 'SELECT * FROM "exams" WHERE id==$1';
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
module.exports = {
  exams: exams,
  getfromdb: getfromdb
};
