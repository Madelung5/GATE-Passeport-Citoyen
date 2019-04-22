const express = require('express');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const session = require('express-session');
//const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client = redis.createClient();
//const router = express.Router();


// création du serveur
const app = express();

// Création des sessions

app.use(session({
	secret: 'debian >> ubuntu',
	store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260}),
	saveUninitialized: false,
	resave: false
}));

// configuration

app.use(bodyParser.urlencoded({ extended: true }))
//app.use(cookieParser());
app.use(bodyParser.json() )
app.use(express.static('public'));
//app.use(app.router);

app.set('view engine', 'jade');
app.set('views', 'templates');

//app.use('/', router);


// Connection à la base de donnée
var connection = mysql.createConnection({
host : 'localhost',
user : 'Citoyen',
password : 'Passeport',
database : 'passeportCitoyen'
});


// routes

app.get('/', (req, res) => {
    res.render('accueil');
});

app.get('/prof', (req, res) => {
    res.render('prof');
});

app.post('/', (req, res, next) => {
  console.log('Inside POST / callback function')
  console.log(req.body)
  const name = req.body.username;
  const password = req.body.psw;
  //req.session.name = req.body.username;
  //req.session.password = req.body.psw;
  //req.session.prof = req.body.profcb;
})

app.post('/passeport', (req, res) => {
    console.log('Inside POST /passeport callback')
    var name = req.body.username;
    var password = req.body.psw;
    var prof = req.body.profcb
    var table = 'loginEleve';
    var tmpl = 'eleve';
    if (prof)
    {
      table = 'loginProfesseur';
      tmpl = 'prof';
    }
    var sql = 'SELECT * FROM ' + table + ' WHERE user = ' + connection.escape(name);
	//console.log('sql vaut ' + sql);
    connection.query(sql, function(err, results) {
    if (err) {
        //res.send("Error during MySql command : " + err);
	return res.redirect('/')
    }
    else {
        if (results.length != 0) {
        var passwordDB = results[0].password;
        if (password == passwordDB) {
            console.log('Local strategy returned true')
	    //req.session.name = name;
	    //req.session.password = password;
 	    //req.session.prof = req.body.profcb
	    req.session.success = true;
	    save_session(req, name, password, prof);	
	    
            res.render(tmpl, { username: name })
        }
        else {
        //res.send("Wrong Password");
		//Faire une sweetalert /!\
        res.redirect('/')
	}
      }
      else {
        //res.send("User doesn't exist.")
        res.redirect('/')
      }
    }
    })
	//req.session.name = name;
	//req.session.password = password;
	//req.session.prof = req.body.profcb;
	var save_session = function(req, name, password, prof){
		var test = 'test'
		console.log('save session!!!!!!!!!!!!!' + name + password + prof + test)

		req.session.name = name;
		req.session.password = password;
		//req.session.prof = prof    /!\ warning prof est undefined si false (unchecked)
	}

})


app.get('/passeport', (req, res) => {
	console.log('Inside GET /passeport callback')
	if(req.session.name){
    		var table = 'loginEleve';
    		var tmpl = 'eleve';
    		if (req.session.prof)
    			{
      			table = 'loginProfesseur';
      			tmpl = 'prof';
    			}
        res.render(tmpl, { username: name })
        }
        else {
        res.redirect('/')
	}
    })



app.get('/passeport/:annee/:name', (req,res) => {
  //TODO Faire la requête en base de données et mettre le résultat sous la forme [Nom atelier, description, validé = 1, non validé = 0]
  //Pour cela récupérer l'année à partir de req.params.annee
	var name = req.session.name
	var id_eleve = 'SELECT id FROM loginEleve WHERE user = ' + connection.escape(req.params.name);
	req.session.id = id_eleve;
	var sqlAteliers = 'SELECT nomAtelier, description, réussite FROM listeAteliers JOIN ateliersSuivis ON listeAteliers.id=ateliersSuivis.atelier WHERE eleve = ' + connection.escape(id_eleve);
	//res.send(connection.escape(sqlAteliers));
    	connection.query(sqlAteliers, function(err, results) {
		if (err){
			res.send("Error during MySQL command: " + err);
		}
		else {
			var ateliers_list = new Array();
			for (var i = 0; i < results.length; i++){
				ateliers_list[i] = [ results[i].nomAtelier, results[i].description, results[i].réussite ];
			}
			res.send('le résultat est ' + ateliers_list); // TEST
			req.session.ateliers = ateliers_list;
			//res.render('passeport', { annee: req.params.annee, username:req.params.name, ateliers: ateliers_list });
		}
	});
		
		//[ ['Atelier 1', 'Description atelier 1', 0], ['Atelier 2', 'Description atelier 2', 1], ['Atelier 3', 'Description atelier 3', 0] ] });

});


// Ecoute sur le port 8080

//app.use('/', router);

app.listen(8080, () => {
    console.log('Listening on localhost:8080');
})
