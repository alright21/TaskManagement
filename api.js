const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
 
var courses_offered = [{id: 21, name: 'HCI'},{id: 28, name:'sweng'}];

app.get('/', (req, res) => res.status(200).send('Hello World!'));
 
app.get('/courses', (req, res) => {
   res.status.json(courses_offered)
});
 
var server = app.listen(PORT, () => console.log('Example app listening on port'+ PORT));

module.exports = server;

