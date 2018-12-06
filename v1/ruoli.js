const express = require('express');
const bodyParser = require('body-parser');
const getUserById = require('./users').getUserById;
const ruoli = express.Router();
const pg = require('pg');

const config = require('../db_config');
const pool = new pg.Pool(config);

ruoli.use(bodyParser.json());

ruoli.get('/', (req, res) => res.status(200).send('Hello World!'));

ruoli.post('/', async(req, res) => {

	if (req.body.permesso == 1)
	{
		var resultA = await insertAssistantIntoDatabase(req.body.id, req.body.classID);
	}
	if (req.body.permesso == 2)
	{
    	var resultS = await insertStudentIntoDatabase(req.body.id, req.body.classID);
    }

	if (resultS && resultA)
	{
		var resultJson = JSON.parse(JSON.stringify(result));
		res.status(201).send(resultJson);
	}
	else
	{
		res.status(404).end();
	}
}); 

ruoli.get('/:id&:permesso', async (req, res) =>{

    //const id = req.params.id;
    console.log('id in ruoli.get ' +id);
    const permesso = req.params.permesso;
    console.log('permesso: ' + permesso);
    //var done; //variabile di appoggio che mi serve per capire quando una funzione asincrona finisce
    for (var id in req.params.id)
    {
    	var results = await getRoles(permesso,id);
    }

    console.log('results: ' + results)
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

async function insertStudentIntoDatabase (id, classID) {
    
    //Controllo che l'utente esista
    console.log('id in insertStudentIntoDatabase: '+id)
    let isUser = await getUserById(id);
    if ( ! isUser  )
    {
    	console.log('l\'utente non esiste!')
        return null;
    }

    let queryText = 'INSERT INTO "ruoli" ("user", "classe", permesso") VALUES ($1, $2, "2") RETURNING *';
    let queryParam = [id, classID];

    let insertStud;
    let res = await pool.query(queryText, queryParam);

    if(res)
    {
        insertStud = JSON.parse(JSON.stringify(res.rows[0]));
    }
    else
    {
        return null;
    }
    return insertStud;
} 

async function insertAssistantIntoDatabase (id, classID) {
    
    //Controllo che l'utente esista
    let isUser = await getUserById(id);
    if ( ! isUser  )
    {
        return null;
    }

    let queryText = 'INSERT INTO "ruoli" ("user", "classe", permesso") VALUES ($1,$2, "1") RETURNING *';
    let queryParam = [id, classID];

    let insertAssistant;
    let res = await pool.query(queryText, queryParam);

    if(res)
    {
        insertAssistant = JSON.parse(JSON.stringify(res.rows[0]));
    }
    else
    {
        return null;
    }
    return insertAssistant;
} 

async function getRoles(id, flag){
	if (flag == 1)
	{
		return results = await getAssistants(id);
	}
	else if (flag == 2)
	{
		return result = await getStudents(id);
	}
	else
	{
		return null;
	}
}

async function getStudents(id){

	console.log('sono in getStudents e id: ' +id);
    if (!id)
    {
    	console.log('sono nel primo if !id')
        return null;
    }
    else
    {
        // select students for that class from table "permissions"
        queryText = 'SELECT ruoli.user FROM "ruoli" WHERE ruoli.classe=$1 AND ruoli.permesso=2';
        let studentsList = []; // this variable is used to store tasks which are in exam
        queryParams = [id]
        result = await pool.query(queryText, queryParams);
        console.log('sonon nell\'else e result: '+result)
        if(result.rowCount != 0)
        {
            for (var i = 0; i < result.rowCount; i++)
            {
                studentsList.push(result.rows[i]);
            }
        }
        console.log('students: ' +studentsList);
        return studentsList;
    }
    
}

async function getAssistants(id){

    if (!id)
    {
        return null;
    }
    else
    {
        queryText = 'SELECT ruoli.user FROM "ruoli" WHERE ruoli.classe=$1 AND ruoli.permesso=1';
        let assistantsList = [];
        queryParams = [id] 
        result = await pool.query(queryText, queryParams);
        if(result.rowCount != 0)
        {
            for (var i = 0; i < result.rowCount; i++)
            {
                assistantsList.push(result.rows[i]);
            }
        }
        return assistantsList;
    }
}

module.exports = {
	ruoli: ruoli,
	insertStudentIntoDatabase: insertStudentIntoDatabase,
	insertAssistantIntoDatabase: insertAssistantIntoDatabase,
	getStudents: getStudents,
	getAssistants: getAssistants
}