const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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
  const name = req.body.username;
  const password = req.body.psw;
  res.send(`POST du login\n`)
})

// configuration de Passport.js en local strategy
passport.use(new LocalStrategy(
  { usernameField: 'pseudo' },
  (name, password, done) => {
    console.log('Inside local strategy callback')
    var sql = 'SELECT * FROM loginEleve WHERE user = ' + connection.escape(name);
    connection.query(sql, function(err, results) {
    if (err) {
        res.send("Error during MySql command : " + err);
    } 
    else {
        const passwordDB = results[0].password;
        if (password == passwordDB) {
            console.log('Local strategy returned true')
            return done(null, user)
        }
        else {
        res.send("Bad Password");
        }
    }
  });
  }
));

// Ecoute sur le port 8080
app.listen(8080, () => {
    console.log('Listening on localhost:8080');
})


