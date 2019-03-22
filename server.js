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
app.use(express.static('public'));

app.set('view engine', 'jade');
app.set('views', 'templates');

app.get('/', (req, res) => {
    res.render('accueil');
});

app.post('/', (req, res, next) => {
  console.log('Inside POST / callback function')
  console.log(req.body)
  const name = req.body.username;
  const password = req.body.psw;

})

app.post('/passeport', (req, res) => {
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

            res.render('testeleve', { username: name })
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

app.get('/passeport/:annee/:name', function(req,res) {
  //TODO Faire la requête en base de données et mettre le résultat sous la forme [Nom atelier, description, validé = 1, non validé = 0]
  //Pour cela récupérer l'année à partir de req.params.annee
    res.render('testeleveclasse', { annee: req.params.annee, username:req.params.name, ateliers: [ ['Atelier 1', 'Description atelier 1', 0], ['Atelier 2', 'Description atelier 2', 1], ['Atelier 3', 'Description atelier 3', 0] ] });

});

// Ecoute sur le port 8080
app.listen(8080, () => {
    console.log('Listening on localhost:8080');
})
