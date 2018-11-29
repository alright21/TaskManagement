const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const users = express.Router();

const pool = new pg.Pool({
	user: process.env.USER,
	host: process.env.HOST,
	database: process.env.DATABASE,
	password: process.env.PASSWORD,
	port: process.env.PORT
});

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
module.exports = {
	users: users,
	getUserById: getUserById,
	getUserByEmail: getUserByEmail,
	postUser: postUser
};