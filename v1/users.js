const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const users = express.Router();


const config = require('../db_config');
const pool = new pg.Pool(config);

users.use(bodyParser.json());
users.use(bodyParser.urlencoded({ extended: true }));

users.post('/', async (req, res) => {
	const toInsert = req.body;
	//Check if user already in
	let check = await getUserByEmail(toInsert.email);
	if(check){
		let resultnegJSON = JSON.parse(JSON.stringify({}));
		res.status(400).send(resultnegJSON);
	}else{ //User not in db
		let result = await postUser(toInsert);
		if(result){
			let resultJson = JSON.parse(JSON.stringify(result));
			res.status(201).send(resultJson);
		}
		else{
			let resultnegJSON = JSON.parse(JSON.stringify({}));
			res.status(400).send(resultnegJSON);
		}
	}
});

users.get('/:userID',async (req, res) => {
	const userID = req.params.userID;
	let result = await getUserById(userID);

	if(result){
		let resultJSON = JSON.parse(JSON.stringify(result));
		res.status(200).send(resultJSON);
	}else{
		let resultnegJSON = JSON.parse(JSON.stringify({}));
		res.status(400).send(resultnegJSON);
	}
});


users.get('/:id/exams', async(req,res)=> {
  res.status(200).send("ciao "+req.params.id);
  let result=await getExams(req.params.id);
  if(result){
       var resultJson = JSON.parse(JSON.stringify(result));
       res.status(200).send(resultJson);
   }
   else{
     let resultnegJSON = JSON.parse(JSON.stringify({}));
       res.status(404).send(resultnegJSON);
   }
});

users.get('/:id/tasks', async(req,res)=> {
  console.log(req.params.id);
  res.status(200);
    var result=await getTasks(req.params.id);
    if(result){
           var resultJson = JSON.parse(JSON.stringify(result));
           res.status(200).send(resultJson);
       }
       else{
            let resultnegJSON = JSON.parse(JSON.stringify({}));
            res.status(404).send(resultnegJSON);
       }
});




//FUNCTIONS INTERFACING WITH THE DB
async function getUserById(id){
	if(!id){
		return null;
	}else{
		var queryText = 'SELECT * FROM "user" WHERE id=$1';
		var queryParams = [id];
		var result = await pool.query(queryText, queryParams);
		if(result.rowCount != 0){
			return result.rows[0];
		}else{
			return null;
		}
	}
}

async function postUser(newUser){
	if(!newUser.name || !newUser.surname || !newUser.email || !newUser.password)
		return null;
	else{
		let queryText = 'INSERT INTO "user" ("name","surname","email","password") VALUES ($1,$2,$3,$4) RETURNING *';
		let queryParams = [newUser.name, newUser.surname, newUser.email, newUser.password];
		let result = await pool.query(queryText, queryParams);
		if(result){
			return result.rows[0];
	  	}else{
			return null;
		}
	}
}

async function getUserByEmail(email){
	if(!email){
		return null;
	}else{
		var queryText = 'SELECT * FROM "user" WHERE email=$1';
		var queryParams = [email];
		var result = await pool.query(queryText, queryParams);
		if(result.rowCount != 0){
			return result.rows[0];
		}else{
			return null;
		}
	}
}

//GET TASKS FROM DB WHERE CREATOR==ID
async function getTasks(id){
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
async function getExams(id){
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

module.exports = {
	users: users,
	getUserById: getUserById,
	getUserByEmail: getUserByEmail,
  getTasks : getTasks,
  getExams: getExams,
	postUser: postUser
};
