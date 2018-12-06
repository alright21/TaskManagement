const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const users = require('./v1/users').users;

const exams = require('./v1/exams').exams;

const tasks = require('./v1/tasks').tasks;
const submissions = require('./v1/submissions').submissions;
const classes = require('./v1/classes').classes;
const review = require('./v1/review').review;
const ruoli = require('./v1/ruoli').ruoli;

app.use(bodyParser.json());

app.use('/v1/users', users);
app.use('/v1/exams', exams);
app.use('/v1/tasks', tasks);
app.use('/v1/submissions', submissions);
app.use('/v1/classes', classes);
app.use('/v1/review', review);
app.use('/v1/ruoli', ruoli);

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => res.status(200).send('Hello World!'));

let server = app.listen(PORT, () => console.log('Example app listening on port '+ PORT));

module.exports = async () => {
    global.SERVER__ = server;
};
