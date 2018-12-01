const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const users = require('./v1/users').users;

const exams = require('./v1/exams').exams;

const tasks = require('./v1/tasks');
const submissions = require('./v1/submissions').submissions;
const classes = require('./v1/classes');
const reviews = require('./v1/reviews');

app.use(bodyParser.json());

app.use('/v1/users', users);
app.use('/v1/exams', exams);
app.use('/v1/tasks', tasks);
app.use('/v1/submissions', submissions);
app.use('/v1/classes', classes);
app.use('/v1/reviews', reviews);

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => res.status(200).send('Hello World!'));


var server = app.listen(PORT, () => console.log('Example app listening on port '+ PORT));


module.exports = server;
