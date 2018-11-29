const express = require('express');
const bodyParser = require('body-parser');
const classes = express.Router();
const pg = require('pg');

const pool = new pg.Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'taskmanagement',
	port: '5432'
});

classes.use(bodyParser.json());

//classes.get('/', (req, res) => res.status(200).send('Hello World!'));
/*const postedClasses = [];
const postedClasses = [];
classes.post('/', function(req, res) {
	const newClass = req.body;
	newClass.id = 1;
	postedClasses.push(newClass);
	res.status(201);
	res.json(newClass).send();
}); */

/*CODICE CHE SERVIRA' UNA VOLTA CHE AVRO' IL DATABASE*/


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

classes.get('/:id', async (req, res) =>{
    console.log(req.params.id);
    let results = await getClassById(req.params.id);
    console.log(results);
    if(results)
    {
        var resultJson = JSON.parse(JSON.stringify(results));
        res.status(200).send(resultJson);
    }
    else
    {
        res.status(404).end();
    }
});


async function insertClassIntoDatabase (classe){
    
    // check class's name exists into database
    let isName = await getUserById(classe.name);
    if(!isName)
        return null;
    
    // check prof exists into database
    let isUser = await getUserById(classe.prof);
    if(!isUser)
        return null;

    // check every assistants exist into database
    // check every students exists into database

    // insert exam into database
    let queryText = 'INSERT INTO "class" ("name", "prof", "description") VALUES ($1, $2, $3) RETURNING *';
    let queryParam = [classe.name, classe.prof, classe.description];

    let insertClass;
    let res = await pool.query(queryText, queryParam);

    if(res)
        insertExam = JSON.parse(JSON.stringify(res.rows[0]));
    else
        return null;


    // insert every assistant into database table "permissions"
    // put a new param into the json called assistantList
    // insert every students into database table "permissions"
    // put a new param into the json called studentsList

    // return the class with the id
    return insertClass;
} 

//funzione di appoggio
async function getUserById(id){
    
    if(!id)
    {
        return null;
    }
    else
    {
        const queryText = 'SELECT * FROM "user" WHERE id=$1';

        let queryParams = [id];
        let result = await pool.query(queryText, queryParams);
        
        if(result.rowCount != 0)
        {
            return result.rows[0];
        }
        else
        {
            return null;
        }
    }
}

async function getClassById(id){

    if(!id)
    {
        return null;
    }
    else
    {
        // select class from table "class"
        let queryText = 'SELECT * FROM "class" WHERE id=$1';
        let queryParams = [id];
        let result = await pool.query(queryText, queryParams);
		var classe; //Variabile chiamata "classe" perchè la parola "class" è riservata
		if(result.rowCount != 0)
        {
            classe = JSON.parse(JSON.stringify(result.rows[0]));
        }
        else
        {
            return null;
        }
      
/*
        // select assistants for that class from table "permissions"
        queryText = 'SELECT * FROM "permissions" WHERE permission=$1';
        let assistantsList = []; // this variable is used to store tasks which are in exam
        result = await pool.query(queryText, queryParams);
        if(result.rowCount != 0)
        {
            for (var i = 0; i < result.rowCount; i++)
            {
                assistantsList.push(result.rows[i].user);
            }
        }
        // add the list of assistants to class variable
        classe.assistants = assistantsList;

        // select students for that class from table "permissions"
        queryText = 'SELECT * FROM "permissions" WHERE permission=$2';
        let studentsList = []; // this variable is used to store tasks which are in exam
        result = await pool.query(queryText, queryParams);
        if(result.rowCount != 0)
        {
            for (var i = 0; i < result.rowCount; i++)
            {
                studentsList.push(result.rows[i].user);
            }
        }
        classe.students = studentsList;
*/
        return classe;
    }
}

module.exports = {
    classes: classes,
    insertClassIntoDatabase: insertClassIntoDatabase,
    getClassById: getClassById
}
