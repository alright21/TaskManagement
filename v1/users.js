const express = require('express');
const bodyParser = require('body-parser');
const users = express.Router();


users.get('/', (req, res) => res.status(200).send('Hello World!'));


users.get('/:id/tasks',(req,res)=> {
      res.status(200).send("Hello "+req.params.id/*query per il database*/);
  });



module.exports = users;
