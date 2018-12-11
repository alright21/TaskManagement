const express = require('express');
const bodyParser = require('body-parser');
const getUserById = require('./users').getUserById;
const classes = express.Router();
const pg = require('pg');
const config = require('../db_config');
const pool = new pg.Pool(config);

classes.use(bodyParser.json());

classes.get('/', (req, res) => res.status(200).send('Hello World!'));

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

    const id = req.params.id;
    let results = await getClassById(req.params.id);
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

classes.put('/:id', async (req, res) => {

    const id = req.params.id;
    const toModify = req.body;
    if(!id)
    {
        res.status(400).end();
    }
    var result = await updateClassInDatabase(id, toModify);
    if(result)
    {
        var resultJson = JSON.parse(JSON.stringify(result));
        res.status(201).send(resultJson);
    }
    else
    {
        res.status(409).end();
    }
});


async function insertClassIntoDatabase (classe){
    
    //check prof exists into database
    let isUser = await getUserById(classe.prof);
    if(!isUser)
    {
        return null;
    }

    // insert class into database
    let queryText = 'INSERT INTO "classe" ("name", "prof", "description") VALUES ($1, $2, $3) RETURNING *';
    let queryParam = [classe.name, classe.prof, classe.description];
    let insertClass;
    let res = await pool.query(queryText, queryParam);
    if(res)
    {
        

        try{
            res.rows[0].assistants = await insertRoles(classe.assistants, 1, res.rows[0].id);
        }catch(e){
            console.log(e);
        }
        try{
            res.rows[0].students = await insertRoles(classe.students, 2, res.rows[0].id);
        }catch(e){
            console.log(e);
        }

        insertClass = JSON.parse(JSON.stringify(res.rows[0]));

        
    }
    else
    {
        return null;
    }

    return insertClass;
} 

async function getClassById(id){

    if(!id)
    {
        return null;
    }
    else
    {
        // select class from table "classe"
        let queryText = 'SELECT * FROM "classe" WHERE id=$1';
        let queryParams = [id];
        let result = await pool.query(queryText, queryParams);
		var classe; //Variabile chiamata "classe" perchè la parola "class" è riservata
		if(result.rowCount != 0)
        {
            try{
                result.rows[0].assistants = await getRoles(id,1);
            }catch(e){
                console.log(e);
            }
        try{
            result.rows[0].students = await getRoles(id,2);
        }catch(e){
            console.log(e);
        }
            

            classe = JSON.parse(JSON.stringify(result.rows[0]));
        }
        else
        {
            return null;
        }

        /*var students = getStudents(id);
        for (var student in students )
        {
            classe.students[student] = students[student];
        }

        var assistants = getAssistants(id);
        for (var assistant in assistants)
        {
            classe.assistants[assistant] = assistants[assistant];
        }*/
        return classe;
    }
}

//Update function
async function updateClassInDatabase(id, toModify){

    id = Number.parseInt(id);
    if(!id && !toModify)
    {
        return null;
    }
    else
    {
        var isClass = await getClassById(id);
        if(!isClass)
        {
            return null;
        }
        else
        {
        	if(isClass.prof != toModify.prof)
        	{
                return null;
			}
            else 
            {
	            var queryText = 'UPDATE "classe" SET "name"=$1, "description"=$2 WHERE "id"=$3 RETURNING *';
	            var queryParams = [toModify.name, toModify.description, id];
	            var result = await pool.query(queryText,queryParams);
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
    }
}


async function insertRoles(array, role, classe){

    let result = [];
    if(!array){
        return result;
    }
    
    for(let i = 0; i< array.length; i++){
        const queryText = 'INSERT INTO "ruoli" VALUES($1,$2,$3) RETURNING *';
        const queryParams = [array[i], classe, role];

        let r;
        try{
            r = await pool.query(queryText,queryParams);
        }catch (e){
            console.log(e);
        }
        if(r){
            result.push(r.rows[0]);
        }
        
    }

    return result;
}


async function getRoles(classe, role){

    const queryText = 'SELECT * FROM "ruoli" WHERE "classe"=$1 AND "permesso"=$2';
    const queryParams = [classe, role];

    let result = [];

    let r;
    try{
        r = await pool.query(queryText,queryParams);
    }catch(e){
        console.log(e);
    }
    if(r){
        for(let i = 0; i< r.rowCount; i++){
            result.push(r.rows[i]);
        }
    }
    

    return result;

    
}

module.exports = {
    classes: classes,
    insertClassIntoDatabase: insertClassIntoDatabase,
    getClassById: getClassById,
    updateClassInDatabase: updateClassInDatabase
}