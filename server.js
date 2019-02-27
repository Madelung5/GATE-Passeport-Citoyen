const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json() )

// Connection à la base de donnée
const connection = mysql.createConnection({
host : 'localhost',
user : 'Citoyen',
password : 'Passeport',
database : 'passeportCitoyen'
});

// création du serveur
const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/accueil.html')
});

app.post('/', (req, res) => {
  console.log('Inside POST / callback function')
  console.log(req.body)
  res.send(`POST du login\n`)
})

// Ecoute sur le port 8080
app.listen(8080, () => {
    console.log('Listening on localhost:8080');
})
