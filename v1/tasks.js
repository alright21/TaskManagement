const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const tasks = express.Router();

const getUserById = require('../v1/users').getUserById;

const config = require('../db_config');
const pool = new pg.Pool(config);

tasks.post('/', async (req,res) => {
	
	if(!req.body){
        res.status(400).end();
    }
    var result = await insertTaskInDatabase(req.body);

    if(result){

        var resultJson = JSON.parse(JSON.stringify(result));
        res.status(201).send(resultJson);
    }
    else{
        res.status(400).end();
    }
});



tasks.put('/:id', async (req,res) => {

	const id = Number.parseInt(req.params.id);
    const toModify = req.body;
    if(!id){
        res.status(400).end();
    }
    var result = await updateTaskInDatabase(id, toModify);

    if(result){
        var resultJson = JSON.parse(JSON.stringify(result));

        res.status(201).send(resultJson);
    }else{
        res.status(409).end();
    }

});

tasks.get('/:id', async (req,res) => {

	const id = Number.parseInt(req.params.id);

    if(!id){

        res.status(400).end();
    }

	var result = await getTaskById(id);

    if(result){
        var resultJson = JSON.parse(JSON.stringify(result));
        res.status(200).send(resultJson);
    }else{
        res.status(404).end();
    }
});


async function insertTaskInDatabase(task){

	if(arguments.length !== 1){
        return null;
    }
    if(!task){
        return null;
    }
    //Qui ci andrà la logica per controllare che user, task e exam esistano per evitare problemi di database
    var isUser = await getUserById(task.creator);
    
    if(!isUser){

        return null;
    }else{

        var queryText = 'INSERT INTO "task" ("creator","task_type","question", "example", "mark") VALUES($1,$2,$3,$4,$5) RETURNING *';
        var queryParams = [task.creator, task.task_type, task.question, task.example, task.mark]; 
        

        //non sono sicuro che serva
        var result = await pool.query(queryText, queryParams);
        if(result){
			if(task.task_type === 0){
				return result.rows[0];
			}else{

				let newTask = result.rows[0];

				let multipleChoices = await insertMultipleChoices(task.multiple_choices, result.rows[0].id);
				if(multipleChoices){
					newTask.multiple_choices = multipleChoices;
					return newTask;
				}else{ 
					return null;
				}
			}

        }else{
            return null;
        }
    }
}
async function updateTaskInDatabase(id, toModify){

	if(arguments.length !== 2){
        return null;
    }
    id = Number.parseInt(id);
    if(!id || !toModify ){
        return null;
    }else{
		var isTask = await getTaskById(id);
		var isCreator = await getUserById(toModify.creator);

        if(!isTask || !isCreator){
            return null;
        }else{
            
			console.log(id);
			var queryText = 'UPDATE "task" SET "creator"=$1,"task_type"=$2, "question"=$3, "example"=$4, "mark"=$5 WHERE "id"=$6 RETURNING *';
			var queryParams = [toModify.creator,toModify.task_type, toModify.question, toModify.example, toModify.mark, id];

			var result = await pool.query(queryText,queryParams);
			console.log('fatta la query');
			//non sono sicuro che serva
			if(result.rowCount != 0){
				let task = result.rows[0];
				if(task.task_type ===0){
					return task;
				}else{
					console.log("ora modifico multiple_choices");
					let multipleChoicesResult = await updateMultipleChoices(toModify.multiple_choices);
					if(multipleChoicesResult){
						task.multiple_choices = await getMultipleChoices(id);
						return task;
					}else{
						return null;
					}
				}
			}else{
				return null;
			}

            
        }
    }

}

async function updateMultipleChoices(multipleChoices){

	console.log(multipleChoices);
	if(arguments.length !== 1){
        return null;
	}
	if(!multipleChoices){
		return null;
	}
	let isList = true;
	for(let i = 0; i<multipleChoices.length; i++){
		console.log(multipleChoices[i].id);
		let getResult = await getMultipleChoice(multipleChoices[i].id);
		if(!getResult){
			isList = false;
		}
	}
	console.log("isList: " + isList);
	if(!isList){
		return null;
	}else{

		let list = [];
		for(let i = 0; i<multipleChoices.length;i++){

			console.log(multipleChoices[i]);
			let queryText = 'UPDATE "multiple_choices" SET "answer"=$1 WHERE "id"=$2 RETURNING *';
			let queryParams = [multipleChoices[i].answer,multipleChoices[i].id];

			let result = await pool.query(queryText,queryParams);
			if(result){
				// console.log(result);
				list.push(result.rows[0]);
				console.log(result.rows[0]);
			}else{
				return null;
			}

		}
		// console.log(list);
		return list;
	}

}

async function getMultipleChoice(id){

	
    if(arguments.length !== 1){
        return null;
    }

    if(!id){
        return null;
    }else{

        var queryText = 'SELECT * FROM "multiple_choices" WHERE id=$1';
        var queryParams = [id];
        var result = await pool.query(queryText, queryParams);

		let task;
        if(result.rowCount != 0){

			return result.rows[0];
        }else{
            return null;
        }

    }
}
async function getTaskById(id){

    if(arguments.length !== 1){
        return null;
    }

    if(!id){
        return null;
    }else{

        var queryText = 'SELECT * FROM "task" WHERE id=$1';
        var queryParams = [id];
        var result = await pool.query(queryText, queryParams);

		let task;
        if(result.rowCount != 0){

			task = result.rows[0];
			
			let multipleChoices = await getMultipleChoices(id);

			if(multipleChoices){
				task.multiple_choices = multipleChoices;
				
			}else{
				task.multiple_choices = null;
			}
			return task;
        }else{
            return null;
        }

    }
}

async function getMultipleChoices(id){

    if(arguments.length !== 1){
        return null;
    }

    if(!id){
        return null;
    }else{

        var queryText = 'SELECT * FROM "multiple_choices" WHERE "task"=$1';
        var queryParams = [id];
        var result = await pool.query(queryText, queryParams);

        if(result.rowCount != 0){

			let multipleChoices = [];
			for(let i = 0; i < result.rowCount; i++){
				multipleChoices.push(result.rows[i]);
			}
			return multipleChoices;
        }else{
            return null;
        }

    }
}


async function insertMultipleChoices(multipleChoices, task){

	if(arguments.length !== 2){
        return null;
    }

    if(!multipleChoices){

		return null;
	}else{

		let resultList = true;
		let list = [];
		for(let i = 0; i < multipleChoices.length; i++){

			var queryText = 'INSERT INTO "multiple_choices" ("task","answer") VALUES ($1,$2) RETURNING *';
			var queryParams = [task, multipleChoices[i].answer];

			var result = await pool.query(queryText,queryParams);

			if(!result){
				resultList = false;
			}else{
				list.push(result.rows[0]);
			}
		}
		if(resultList){
			return list;
		}else{
			return null;
		}
	}
}

module.exports = {
	tasks: tasks,
	insertTaskInDatabase: insertTaskInDatabase,
	insertMultipleChoices: insertMultipleChoices,
	getTaskById: getTaskById,
	getMultipleChoices: getMultipleChoices,
	getMultipleChoice: getMultipleChoice,
	updateTaskInDatabase: updateTaskInDatabase,
	updateMultipleChoices: updateMultipleChoices
};
