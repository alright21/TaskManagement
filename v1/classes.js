const express = require('express');
const bodyParser = require('body-parser');
const classes = express.Router();
const pg = require('pg');

/*const pool = new pg.Pool( {
	user: 'postgres',
	host: 'localhost',
	database: 'taskmanagement',
	port: '5432'
});*/

classes.use(bodyParser.json());

//classes.get('/', (req, res) => res.status(200).send('Hello World!'));

const postedClasses = [];


classes.post('/', function(req, res) {
	const newClass = req.body;
	newClass.id = 1;
	postedClasses.push(newClass);
	res.status(201);
	res.json(newClass).send();
});

/*CODICE CHE SERVIRA' UNA VOLTA CHE AVRO' IL DATABASE

classes.post('/', async(req, res) => {
	var result = await insertClassIntoDatabase(req.body);
	if (result) 
	{
		var resultJson = JSON.parse(JSON.stringify(result));
		res.status(201).send(resultJson);
	}
	else
	{
		res.status(404).end();
	}
});

async function insertClassIntoDatabase (classes){

 //controlli sui campi del db

    var queryText = 'INSERT INTO "classes" ("name","prof","assistants", "students") VALUES($1,$2,$3,$4) RETURNING *';
    var queryParams = [classes.name, classes.prof, classes.assistants, classes.students];     
    var result = [1];
    //var result = await pool.query(queryText, queryParams);
    if(result)
    {
        return result.rows[0];
    }
    else
    {
        return null;
    }
}  */


module.exports = classes;
