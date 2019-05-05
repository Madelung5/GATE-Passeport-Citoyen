const express = require('express');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const session = require('express-session');
//const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
//const redis = require('redis');
//const redisStore = require('connect-redis')(session);
//const client = redis.createClient();



// création du serveur
const app = express();

// Création des sessions

app.use(session({
	secret: 'debian >> ubuntu',
	//store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260}),
	saveUninitialized: false,
	resave: false
}));

// configuration

var http = require('http').Server(app)

app.use(bodyParser.urlencoded({ extended: true }))
//app.use(cookieParser());
app.use(bodyParser.json() )
app.use(express.static('public'));
//app.use(app.router);

app.set('view engine', 'jade');
app.set('views', 'templates');


var router = express.Router();


// Connection à la base de donnée

var connection = mysql.createConnection({
host : 'localhost',
user : 'Citoyen',
password : 'Passeport',
database : 'passeportCitoyen'
});


// routes

router.get('/', (req, res) => {
    res.render('accueil');
});

router.get('/prof', (req, res) => {
    res.render('prof');
});

router.post('/', (req, res, next) => {
  console.log('Inside POST / callback function')
  console.log(req.body)
  const name = req.body.username;
  const password = req.body.psw;
})

router.post('/passeport', (req, res) => {
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
	    req.session.name = name;
	    req.session.password = password;
 	    req.session.prof = req.body.profcb
	    //req.session.success = true;
	    //save_session(req, name, password, prof);	
	    
            res.render(tmpl, { username: req.session.name })
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
	//var save_session = function(req, name, password, prof){
	//	req.session.name = name;
	//	req.session.password = password;
		//req.session.prof = prof    /!\ warning prof est undefined si false (unchecked)
	//}
	console.log(req.session);

})


router.get('/passeport', (req, res) => {
	console.log('Inside GET /passeport callback')
	if(req.session.name){
    		var table = 'loginEleve';
    		var tmpl = 'eleve';
    		if (req.session.prof)
    			{
      			table = 'loginProfesseur';
      			tmpl = 'prof';
    			}
        res.render(tmpl, { username: req.session.name })
        }
        else {
        res.redirect('/')
	}
    })



router.get('/passeport/:annee/:name', (req,res) => {
	
	if (req.session.name) {

		var sqlAteliers = 'SELECT nomAtelier, description, reussite FROM ateliersDisponibles JOIN ateliersSuivis ON ateliersDisponibles.id=ateliersSuivis.atelier JOIN listeAteliers ON ateliersDisponibles.atelier=listeAteliers.id WHERE eleve = (SELECT id FROM loginEleve WHERE user = ' + connection.escape(req.session.name) + 'AND ateliersSuivis.annee = ' + connection.escape(req.params.annee) + ')';
    	
		connection.query(sqlAteliers, function(err, results) {
			if (err){
				//res.send("Error during MySQL command: " + err);
				res.redirect('/passeport')
			}
			else {
				var ateliers_list = new Array();
				for (var i = 0; i < results.length; i++){
					ateliers_list[i] = [ results[i].nomAtelier, results[i].description, results[i].reussite ];
				}
				//console.log('le résultat est ' + ateliers_list);
				req.session.ateliers = ateliers_list;
				res.render('passeport', { annee: req.params.annee, username:req.session.name, ateliers: req.session.ateliers });
			}
		});
	}
	else {
		res.redirect('/')
	}
});



router.post('/gestioneleve', (req,res) =>  { //:name

	if (req.session.prof) {

		var sqlRechercheEleve = 'SELECT eleve, prenom, nom FROM donneesEleves WHERE nom=' + connection.escape(req.body.name) + ' AND prenom=' + connection.escape(req.body.forname) + ' AND college=(SELECT college FROM donneesProfesseurs JOIN loginProfesseur ON donneesProfesseurs.professeur=loginProfesseur.id WHERE  loginProfesseur.user='+ connection.escape(req.session.name)+')';
		// QUID D'UN CAS OU LE PROFESSEUR TRAVAILLE DANS DEUX COLLEGES? CAS D'HOMONYMIE DES ELEVES?
		
		connection.query(sqlRechercheEleve, function(err, results) {
			if (err) {
				res.redirect('/passeport');
			}
			else{
				if (results.length==0){
					res.redirect('/passeport')
				}
				else {
					var eleveData = {id: results[0].eleve, prenom: results[0].prenom, nom:results[0].nom};
					req.session.rechercheEleve = eleveData;
					res.render('gestioneleve', { username: req.session.name, eleve: req.session.rechercheEleve });
				}
			}
		})
		//afficher les ateliers disponibles pour son niveau
		//pouvoir ajouter des ateliers et leur statut. Display warning si déjà validé devient non validé
	}
	else {
		res.redirect('/');
	}
});


router.get('/gestioneleve', (req,res) =>  { 

	if (req.session.rechercheEleve) {

		res.render('gestioneleve', { username: req.session.name, eleve: req.session.rechercheEleve });
	}
	else {
		res.redirect('/');
	}
});



router.get('/gestioneleve/modules', (req,res) => {
	
	if (req.session.prof) {
		
		var today = new Date()
		var annee = parseInt(today.getFullYear(), 10)
		var sqlAteliers = 'SELECT donneesProfesseurs.nom, donneesProfesseurs.prenom, nomAtelier, description FROM ateliersDisponibles JOIN listeAteliers ON ateliersDisponibles.atelier=listeAteliers.id JOIN donneesProfesseurs ON donneesProfesseurs.professeur=ateliersDisponibles.professeur WHERE ateliersDisponibles.annee = ' + connection.escape(annee) + ' OR ateliersDisponibles.annee = ' + connection.escape(annee+1);

		console.log(sqlAteliers);
    	
		connection.query(sqlAteliers, function(err, results) {
			if (err){
				//res.send("Error during MySQL command: " + err);
				res.redirect('/gestioneleve')
			}
			else {
				var ateliers_list = new Array();
				for (var i = 0; i < results.length; i++){
					ateliers_list[i] = [ results[i].nomAtelier, results[i].description, results[i].prenom+ ' '+ results[i].nom ];
				}
				req.session.ateliers = ateliers_list;
				res.render('modules', { eleve: req.session.rechercheEleve, ateliers: req.session.ateliers });
			}
		});
	}
	else {
		res.redirect('/')
	}
});



router.get('/gestioneleve/:name/passeport/:annee', (req,res) => {
	
	if (req.session.rechercheEleve) {

		var sqlAteliers = 'SELECT nomAtelier, description, reussite, donneesProfesseurs.nom, donneesProfesseurs.prenom FROM ateliersDisponibles JOIN ateliersSuivis ON ateliersDisponibles.id=ateliersSuivis.atelier JOIN listeAteliers ON ateliersDisponibles.atelier=listeAteliers.id JOIN donneesProfesseurs ON donneesProfesseurs.professeur=ateliersDisponibles.professeur WHERE eleve =' + connection.escape(req.session.rechercheEleve.id) + ' AND ateliersSuivis.annee = ' + connection.escape(req.params.annee);

		console.log(sqlAteliers);

    	
		connection.query(sqlAteliers, function(err, results) {
			if (err){
				//res.send("Error during MySQL command: " + err);
				res.redirect('/gestioneleve')
			}
			else {
				var ateliers_list = new Array();
				for (var i = 0; i < results.length; i++){
					ateliers_list[i] = [ results[i].nomAtelier, results[i].description, results[i].reussite, results[i].prenom+' '+results[i].nom ];
				}
				req.session.ateliers = ateliers_list;
				res.render('visionnage', { annee: req.params.annee, eleve: req.session.rechercheEleve, ateliers: req.session.ateliers });
			}
		});
	}
	else {
		res.redirect('/')
	}
});


router.get('/logout', (req, res) => {
	
	req.session.destroy();
  	res.send("you've been logged out!");
});


// Ecoute sur le port 8080

app.use('/', router);

http.listen(8080, () => {
    console.log('Listening on localhost:8080');
})
