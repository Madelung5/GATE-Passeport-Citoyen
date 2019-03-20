const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
//const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;


// Connection à la base de donnée
var connection = mysql.createConnection({
host : 'localhost',
user : 'Citoyen',
password : 'Passeport',
database : 'passeportCitoyen'
});


// création du serveur
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json() )


app.get('/', (req, res) => {
    res.sendFile(__dirname +'/accueil.html')
});

app.post('/', (req, res, next) => {
  console.log('Inside POST / callback function')
  console.log(req.body)
  const name = req.body.username;
  const password = req.body.psw;

})

app.post('/testeleve', (req, res) => {
    console.log('Inside POST /passeport callback')
    var name = req.body.username;
  var password = req.body.psw;
  var sql = 'SELECT * FROM loginEleve WHERE user = ' + connection.escape(name);
    connection.query(sql, function(err, results) {
    if (err) {
        res.send("Error during MySql command : " + err);
    }
    else {
        if (results.length != 0) {
        var passwordDB = results[0].password;
        if (password == passwordDB) {
            console.log('Local strategy returned true')
            res.send("Connexion réussie.");
        }
        else {
        res.send("Wrong Password");
        }
      }
      else {
        res.send("User doesn't exist.")
      }
    }
    })
})

// Ecoute sur le port 8080
app.listen(8080, () => {
    console.log('Listening on localhost:8080');
})
