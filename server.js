
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


// Connection à la base de donnée
const connection = mysql.createConnection({
host : 'localhost',
user : 'Citoyen',
password : 'Passeport',
database : 'passeportCitoyen'
});

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
        res.send("Wrong Password");
        }
    }
  });
  }
));


// création du serveur
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json() )

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.sendFile(__dirname +'/accueil.html')
});

app.post('/', (req, res, next) => {
  console.log('Inside POST / callback function')
  console.log(req.body)
  const name = req.body.username;
  const password = req.body.psw;
  passport.authenticate('local', (err, user, info) => {
  req.login(user, (err) => {
      return res.send('You were logged in!\n');
    })
  })(req, res, next);
})

app.get('/passeport', (req, res) => {
  console.log('Inside GET /passeport callback')
  if(req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n')
  } else {
    res.redirect('/')
  }
})

// Ecoute sur le port 8080
app.listen(8080, () => {
    console.log('Listening on localhost:8080');
})


