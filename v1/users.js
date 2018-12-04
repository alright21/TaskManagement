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
	var id=req.params.id;
		let result = await getExams(id);
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
	var id=req.params.id;
		let result = await getTasks(id);
	if(result){
		var resultJson = JSON.parse(JSON.stringify(result));
		res.status(200).send(resultJson);
	}
	else{
		let resultnegJSON = JSON.parse(JSON.stringify({}));
		res.status(404).send(resultnegJSON);
	}
});

users.get('/:id/reviews', async(req,res)=> {
	var id=req.params.id;
		let result = await getReviews(id);
	if(result){
		var resultJson = JSON.parse(JSON.stringify(result));
		res.status(200).send(resultJson);
	}
	else{
		let resultnegJSON = JSON.parse(JSON.stringify({}));
		res.status(404).send(resultnegJSON);
	}
});


users.put('/:userID', async (req, res) => {
	const userID = Number.parseInt(req.params.userID);
	const toModify = req.body;

	if(!userID){
		res.status(400).end();
	}else{
		let result = await updateUserInDatabase(userID, toModify);
		if(result){
			let resultJSON = JSON.parse(JSON.stringify(result));
			res.status(200).send(resultJSON);
		}else{
			res.status(409).end();
		}
	}
});

users.delete('/:id',async (req, res) => {
	const id = req.params.id;
	let result = await deleteUserById(id);
	if(result){
		let check = await getUserById(id);
 		if(check==null){
			res.status(204).end(); // RICHIESTA ANDATA A BUON FINE
		}else{
			res.status(404).end(); // RICHIESTA NON ESEGUITA
		}
	}else{
		res.status(404).end(); // RICHIESTA NON ESEGUITA
	}
});

//DELETE only for testing
users.delete('/', async (req, res) => {
	let result = await deleteAllUsers();

	if(result)
		res.status(204).send();
	else
		res.status(404).end();
});

async function deleteAllUsers(){
	let queryText = 'DELETE FROM "user" WHERE id > 1 RETURNING *';
	let result = await pool.query(queryText);

	if(result)
		return result;
	else
		return null;
}

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

async function updateUserInDatabase(id, toModify){
	if(arguments.length !== 2){
		return null;
	}
	if(!id || !toModify){
		return null;
	}
	else{
		let isUser = await getUserById(id);
		if(!isUser){
			return null;
		}
		else{
			if(!toModify.name || !toModify.surname || !toModify.email || !toModify.password || isUser.id !== id){
				return null;
			}else{
				let queryText = 'UPDATE "user" SET name=$1, surname=$2, email=$3, password=$4 WHERE  id=$5 RETURNING *';
				let queryParams = [toModify.name, toModify.surname, toModify.email, toModify.password, id];
				let result = await pool.query(queryText, queryParams);

				if(result.rowCount != 0)
					return result.rows[0];
				else
					return null;
			}
		}
	}
}

//GET TASKS FROM DB WHERE CREATOR==ID
async function getTasks(id){
	if(!id){
	  return null;
	}else{
	  let queryText = 'SELECT * FROM "task" WHERE creator=$1';
	  let queryParams = [id];
	  let result = await pool.query(queryText, queryParams);
	  let tasks;
	  if(result.rowCount != 0){
		  return result.rows;
	  }else {
		  return null;
	  }
	}
}
 //GET EXAMS FROM DB WHERE CREATOR==ID
async function getExams(id){
if(!id){
return null;
	}
	else{
		let queryText = 'SELECT * FROM "exam" WHERE creator=$1';
		let queryParams = [id];
		let result = await pool.query(queryText, queryParams);
			if(result.rowCount != 0){
		return result.rows;
		}else {
		return null;
		}
	}
}

//DELETE USERS WITH ID==ID FROM DB
 async function deleteUserById(id){
 	if(!id){
 		return null;
 	}else{
 		var queryText = 'DELETE FROM "user" WHERE id=$1';
 		var queryParams = [id];
		let result = await pool.query(queryText, queryParams);
		if(result.rowCount!=0){
			return JSON.parse(JSON.stringify(result)); //ho eliminato qualcosa
		}else{
			return null; //non ho eliminato nulla
 	}
 }
}

module.exports = {
	users: users,
	getUserById: getUserById,
	getUserByEmail: getUserByEmail,
  getTasks : getTasks,
	getExams: getExams,
	deleteAllUsers: deleteAllUsers,
	postUser: postUser,
	updateUserInDatabase: updateUserInDatabase,
	deleteUserById: deleteUserById
};
