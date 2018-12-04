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
	try{
		var result = await insertTaskInDatabase(req.body);
	}catch(e){
		console.log(e);
	}
    

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
	try{
		var result = await updateTaskInDatabase(id, toModify);

	}catch(e){
		console.log(e);
	}

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
	try{
		var result = await getTaskById(id);
	}catch(e){
		console.log(e);
	}
	

    if(result){
        var resultJson = JSON.parse(JSON.stringify(result));
        res.status(200).send(resultJson);
    }else{
        res.status(404).end();
    }
});

tasks.delete('/:id', async (req, res) => {

	const id = Number.parseInt(req.params.id);

	if(!id){
		res.status(400).end();
	}
	let result;
	try{
		result = await deleteTaskById(id);
	}catch(e){
		console.log(e);
	}

	if(result){
		res.status(204).end();
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
	let isUser;
	try{
		isUser = await getUserById(task.creator);

	}catch(e){
		console.log(e);
	}
    
    if(!isUser || !task.mark){

        return null;
    }else{

        var queryText = 'INSERT INTO "task" ("creator","task_type","question", "example", "mark") VALUES($1,$2,$3,$4,$5) RETURNING *';
        var queryParams = [task.creator, task.task_type, task.question, task.example, task.mark]; 
        

		//non sono sicuro che serva
		try{
			var result = await pool.query(queryText, queryParams);

		}catch(e){
			console.log(e);
		}
        if(result){
			if(task.task_type === 0){
				return result.rows[0];
			}else{

				let newTask = result.rows[0];

				let multipleChoices;
				try{
					multipleChoices = await insertMultipleChoices(task.multiple_choices, result.rows[0].id);

				}catch(e){
					console.log(e);
				}
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
    if(!id || !toModify || !toModify.mark){
        return null;
    }else{
		try{
			var isTask = await getTaskById(id);
		}catch(e){
			console.log(e);
		}

		try{
			var isCreator = await getUserById(toModify.creator);

		}catch(e){
			console.log(e);
		}


        if(!isTask || !isCreator || toModify.task_type > 1 || toModify.task_type < 0){
            return null;
        }else{
            
			var queryText = 'UPDATE "task" SET "creator"=$1,"task_type"=$2, "question"=$3, "example"=$4, "mark"=$5 WHERE "id"=$6 RETURNING *';
			var queryParams = [toModify.creator,toModify.task_type, toModify.question, toModify.example, toModify.mark, id];

			try{
				var result = await pool.query(queryText,queryParams);
			}catch(e){
				console.log(e);
			}
			//non sono sicuro che serva
			if(result.rowCount != 0){
				let task = result.rows[0];
				if(task.task_type ===0){
					return task;
				}else{
					let multipleChoicesResult;
					try{
						multipleChoicesResult = await updateMultipleChoices(toModify.multiple_choices);
					}catch(e){
						console.log(e);
					}
					if(multipleChoicesResult){
						try{
							task.multiple_choices = await getMultipleChoices(id);

						}catch(e){
							console.log(e);
						}
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

	if(arguments.length !== 1){
        return null;
	}
	if(!multipleChoices){
		return null;
	}
	let isList = true;
	for(let i = 0; i<multipleChoices.length; i++){

		let getResult;
		try{
			getResult = await getMultipleChoice(multipleChoices[i].id);
		}catch(e){
			console.log(e);
		}
		if(!getResult){
			isList = false;
		}
	}
	if(!isList){
		return null;
	}else{

		let list = [];
		for(let i = 0; i<multipleChoices.length;i++){

			let queryText = 'UPDATE "multiple_choices" SET "answer"=$1 WHERE "id"=$2 RETURNING *';
			let queryParams = [multipleChoices[i].answer,multipleChoices[i].id];


			let result;
			try{
				result = await pool.query(queryText,queryParams);
			}catch(e){
				console.log(e);
			}
			if(result){
				list.push(result.rows[0]);
			}else{
				return null;
			}

		}
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
		let result; 
		try{
			result= await pool.query(queryText, queryParams);
		}catch(e){
			console.log(e);
		}

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
		let result;
		try{
			result = await pool.query(queryText, queryParams);
		}catch(e){
			console.log(e);
		}
        

		let task;
        if(result.rowCount != 0){

			task = result.rows[0];

			let multipleChoices;
			try{
				multipleChoices = await getMultipleChoices(id);

			}catch(e){
				console.log(e);
			}

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
		
		let result;
		try{
			result = await pool.query(queryText, queryParams);

		}catch(e){
			console.log(e);
		}

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

			let result;
			try{
				result = await pool.query(queryText,queryParams);
			}catch(e){
				console.log(e);
			}
			

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

async function deleteTaskById(id){

	if(arguments.length !== 1){
		return null;
	}
	if(!id){
		return null;
	}else{

		const queryText = 'DELETE FROM "task" WHERE "id"=$1 RETURNING *';
		const queryParams = [id];
		let result;

		try{
			result = await pool.query(queryText,queryParams);
		}catch(e){
			console.log(e);
		}
		console.log();
		if(result.rowCount != 0){
			return result.rows[0];
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
	updateMultipleChoices: updateMultipleChoices,
	deleteTaskById: deleteTaskById
};
