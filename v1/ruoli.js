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

	//console.log('req.body.permesso: ' +req.body.permesso)
	//console.log('req.body.user: ' +req.body.user)
	//console.log('req.body.classe: ' +req.body.classe)
	
	console.log('permesso: '+req.body.permesso)
		if (req.body.permesso == 1)
		{
			for (var i in req.body.user)
			{
				console.log('sono nel primo if');
				var resultA = await insertAssistantIntoDatabase(req.body.user[i], req.body.permesso);
			}
		}
		if (req.body.permesso == 2)
		{
			console.log('sono nel primo if di permesso')
			console.log('body user: ' +req.body.user);
			//for (var i in req.body.user)
			//{
				console.log('sono nel secondo if e i:' +req.body.user);
	    		var resultS = await insertStudentIntoDatabase(req.body.user, req.body.classe, req.body.permesso);
	    	//}
	    }
	console.log('result S in post: '+resultS)

	if (resultS)// && resultA)
	{
		var resultJson = JSON.parse(JSON.stringify(result));
		res.status(201).send(resultJson);
	}
	else if (resultA)// && resultA)
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
    //console.log('id in ruoli.get ' + req.params.id);
    const permesso = req.params.permesso;
    //console.log('permesso: ' + permesso);
    
    for (var id in req.params.id)
    {
    	var results = await getRoles(req.params.id[id],req.params.permesso);
    	console.log('results nel for: ' + results)
    }

    console.log('results: ' + results)
	if(results)
	{   
	    var resultJson = JSON.parse(JSON.stringify(results));
	    res.status(200).send(resultJson);
	    console.log('results: ' + results);
    }


	else
	{
	    res.status(404).end();
	}
});

async function insertStudentIntoDatabase (id, classID, flag) {
    
    //Controllo che l'utente esista
    console.log('id in insertStudentIntoDatabase: '+id)
    let isUser = await getUserById(id);
    console.log("asd")
    console.log('dopo aver cercato l\'utente :' +isUser);
    if ( ! (isUser)  )
    {
    	console.log('l\'utente non esiste!')
        return null;
    }
    //console.log('sono dopo l if')

    let queryText = 'INSERT INTO "ruoli" ("user", "classe", "permesso") VALUES ("SELECT * from user WHERE "id"=$1 " , (SELECT "id" from "classe" WHERE "id"=$2),$3)';
    //let queryText = 'SELECT "user" FROM "ruoli" WHERE "user.id"=$1 AND INSERT INTO "ruoli" ("classe","permesso") VALUES ($2, $3) RETURNING * ';
    //let queryText = 'INSERT INTO "ruoli" ("user", "classe", "permesso") VALUES ($1, $2, $3) RETURNING *';
    let queryParam = [id, classID, flag];
   //console.log('sono appena dopo la query');   
    let insertStud;
    let res = await pool.query(queryText, queryParam);
    console.log('res in insertStudentIntoDatabase: '+res)
    if(res)
    {
        console.log('sono in if di res')
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

    let queryText = 'INSERT INTO "ruoli" ("user", "classe", "permesso") VALUES ($1, $2, "1") ';//RETURNING *';
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
	console.log('id' +id)
	console.log('flag: ' + flag)
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