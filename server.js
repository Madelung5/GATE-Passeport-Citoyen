const express = require('express');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const session = require('express-session');
//const redis = require('redis');
//const redisStore = require('connect-redis')(session);
//const client = redis.createClient();
//const popup = require('popups');
const flash = require('express-flash');

// création du serveur
const app = express();

// Création des sessions

app.use(session({
	secret: 'debian >> ubuntu',
	//store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260}),
	saveUninitialized: false,
	resave: false
}));

// Messages flash

app.use(flash());

app.use(function(req, res, next){
	res.locals.sessionFlash = req.session.sessionFlash;
	delete req.session.sessionFlash;
	next();
});

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
    res.render('accueil', { sessionFlash: res.locals.sessionFlash });
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
    
     
    connection.query(sql, function(err, results) {
    if (err) {
        //res.send("Error during MySql command : " + err);
	req.session.sessionFlash = {
		type: 'error',
		message: 'Désolé, une erreur est advenue.'
	}
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
            res.render(tmpl, { username: req.session.name, sessionFlash: res.locals.sessionFlash })
        }
        else {
        //res.send("Wrong Password");
	req.session.sessionFlash = {
		type: 'error',
		message: 'Nom d\'utilisateur ou mot de passe incorrect'
	}
        res.redirect('/')
	}
      }
      else {
        //res.send("User doesn't exist.")
	req.session.sessionFlash = {
		type: 'error',
		message: 'Nom d\'utilisateur ou le mot de passe incorrect'
	}
        res.redirect('/')
      }
    }
    })
//	console.log(req.session);

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
        res.render(tmpl, { username: req.session.name, sessionFlash: res.locals.sessionFlash })
        }
        else {
		req.session.sessionFlash = {
			type: 'error',
			message: 'Vous n\'êtes pas ou plus authentifié, veuillez vous connecter'
		}

        res.redirect('/')
	}
    })



router.get('/passeport/:annee/:name', (req,res) => {
	
	if (req.session.name) {

		var sqlAteliers = 'SELECT nomAtelier, description, reussite, donneesProfesseurs.nom, donneesProfesseurs.prenom FROM ateliersDisponibles JOIN ateliersSuivis ON ateliersDisponibles.id=ateliersSuivis.atelier JOIN listeAteliers ON ateliersDisponibles.atelier=listeAteliers.id JOIN donneesProfesseurs ON donneesProfesseurs.professeur=ateliersDisponibles.professeur WHERE eleve = (SELECT id FROM loginEleve WHERE user = ' + connection.escape(req.session.name) + 'AND ateliersSuivis.annee = ' + connection.escape(req.params.annee) + ')';

    	
		connection.query(sqlAteliers, function(err, results) {
			if (err){
				//res.send("Error during MySQL command: " + err);
				req.session.sessionFlash = {
					type: 'error',
					message: 'Désolé, une erreur est advenue'
				}
				res.redirect('/passeport')
			}
			else {
				var ateliers_list = new Array();
				for (var i = 0; i < results.length; i++){
					ateliers_list[i] = [ results[i].nomAtelier, results[i].description, results[i].reussite, results[i].prenom+' '+results[i].nom ];
				}
				//console.log('le résultat est ' + ateliers_list);
				req.session.ateliers = ateliers_list;
				res.render('passeport', { annee: req.params.annee, username:req.session.name, ateliers: req.session.ateliers, sessionFlash: res.locals.sessionFlash });
			}
		});
	}
	else {
		req.session.sessionFlash = {
			type: 'error',
			message: 'Vous n\'êtes pas ou plus authentifié, veuillez vous connecter'
		}
		res.redirect('/')
	}
});



router.post('/gestioneleve', (req,res) =>  { //:name

	if (req.session.prof) {

		var sqlRechercheEleve = 'SELECT eleve, prenom, nom FROM donneesEleves WHERE nom=' + connection.escape(req.body.name) + ' AND prenom=' + connection.escape(req.body.forname) + ' AND college=(SELECT college FROM donneesProfesseurs JOIN loginProfesseur ON donneesProfesseurs.professeur=loginProfesseur.id WHERE  loginProfesseur.user='+ connection.escape(req.session.name)+')';
		// QUID D'UN CAS OU LE PROFESSEUR TRAVAILLE DANS DEUX COLLEGES? CAS D'HOMONYMIE DES ELEVES?
		
		connection.query(sqlRechercheEleve, function(err, results) {
			if (err) {
				req.session.sessionFlash = {
					type: 'error',
					message: 'Désolé, une erreur est advenue'
				}

				res.redirect('/passeport');
			}
			else{
				if (results.length==0){
					req.session.sessionFlash = {
						type: 'error',
						message: 'Désolé, il semble n\'y avoir aucun élève de ce nom dans votre collège'
					}
					res.redirect('/passeport')
				}
				else {
					var eleveData = {id: results[0].eleve, prenom: results[0].prenom, nom:results[0].nom};
					req.session.rechercheEleve = eleveData;
					res.render('gestioneleve', { username: req.session.name, eleve: req.session.rechercheEleve, sessionFlash: res.locals.sessionFlash });
				}
			}
		})
		//afficher les ateliers disponibles pour son niveau
		//pouvoir ajouter des ateliers et leur statut. Display warning si déjà validé devient non validé
	}
	else {
		req.session.sessionFlash = {
			type: 'error',
			message: 'Vous n\'êtes pas ou plus authentifié, veuillez vous connecter'
		}
		res.redirect('/');
	}
});


router.get('/gestioneleve', (req,res) =>  { 

	if (req.session.rechercheEleve) {

		res.render('gestioneleve', { username: req.session.name, eleve: req.session.rechercheEleve, sessionFlash: res.locals.sessionFlash });
	}
	else {
		req.session.sessionFlash = {
			type: 'error',
			message: 'Vous n\'êtes pas ou plus authentifié, veuillez vous connecter'
		}
		res.redirect('/');
	}
});



router.get('/gestioneleve/modules', (req,res) => {
	
	if (req.session.prof) {
		
		var today = new Date()
		var annee = parseInt(today.getFullYear(), 10)
		var sqlAteliers = 'SELECT donneesProfesseurs.nom, donneesProfesseurs.prenom, nomAtelier, description, ateliersDisponibles.id FROM ateliersDisponibles JOIN listeAteliers ON ateliersDisponibles.atelier=listeAteliers.id JOIN donneesProfesseurs ON donneesProfesseurs.professeur=ateliersDisponibles.professeur WHERE ateliersDisponibles.annee = ' + connection.escape(annee) + ' OR ateliersDisponibles.annee = ' + connection.escape(annee+1);

		console.log(sqlAteliers);
    	
		connection.query(sqlAteliers, function(err, results) {
			if (err){
				//res.send("Error during MySQL command: " + err);
				req.session.sessionFlash = {
					type: 'error',
					message: 'Désolé, une erreur est advenue'
				}

				res.redirect('/gestioneleve')
			}
			else {
				var ateliers_list = new Array();
				for (var i = 0; i < results.length; i++){
					ateliers_list[i] = [ results[i].nomAtelier, results[i].description, results[i].prenom+ ' '+ results[i].nom, results[i].id ];
				}
				req.session.ateliers = ateliers_list;
				res.render('modules', { eleve: req.session.rechercheEleve, ateliers: req.session.ateliers, sessionFlash: res.locals.sessionFlash });
			}
		});
	}
	else {
		req.session.sessionFlash = {
			type: 'error',
			message: 'Vous n\'êtes pas ou plus authentifié, veuillez vous connecter'
		}
		res.redirect('/')
	}
});



router.get('/gestioneleve/:name/passeport/:annee', (req,res) => {
	
	if (req.session.rechercheEleve) {

		var sqlAteliers = 'SELECT nomAtelier, description, reussite, donneesProfesseurs.nom, donneesProfesseurs.prenom, ateliersSuivis.id FROM ateliersDisponibles JOIN ateliersSuivis ON ateliersDisponibles.id=ateliersSuivis.atelier JOIN listeAteliers ON ateliersDisponibles.atelier=listeAteliers.id JOIN donneesProfesseurs ON donneesProfesseurs.professeur=ateliersDisponibles.professeur WHERE eleve =' + connection.escape(req.session.rechercheEleve.id) + ' AND ateliersSuivis.annee = ' + connection.escape(req.params.annee);

//		console.log(sqlAteliers);

    	
		connection.query(sqlAteliers, function(err, results) {
			if (err){
				//res.send("Error during MySQL command: " + err);
				req.session.sessionFlash = {
					type: 'error',
					message: 'Désolé, une erreur est advenue'
				}

				res.redirect('/gestioneleve')
			}
			else {
				var ateliers_list = new Array();
				for (var i = 0; i < results.length; i++){
					ateliers_list[i] = [ results[i].nomAtelier, results[i].description, results[i].reussite, results[i].prenom+' '+results[i].nom, results[i].id ];
				}
				req.session.ateliers = ateliers_list;
				res.render('visionnage', { annee: req.params.annee, eleve: req.session.rechercheEleve, ateliers: req.session.ateliers, sessionFlash: res.locals.sessionFlash });
			}
		});
	}
	else {
		req.session.sessionFlash = {
			type: 'error',
			message: 'Vous n\'êtes pas ou plus authentifié, veuillez vous connecter'
		}
		res.redirect('/')
	}
});



router.get('/gestioneleve/:name/ajout/:idatelier/:reussite/:annee', (req, res) => {

	if (req.session.rechercheEleve) {

		var insertAtelier = 'INSERT INTO ateliersSuivis(eleve, atelier, reussite, annee) VALUES('+req.session.rechercheEleve.id+', '+req.params.idatelier+', '+req.params.reussite+', '+req.params.annee+')';

//		console.log(insertAtelier);

    	
		connection.query(insertAtelier);

		req.session.sessionFlash = {
			type: 'info',
			message: 'L\'atelier a bien été ajouté! En cas d\'erreur vous pouvez toujours le supprimer à partir de la page de visionnage du passeport de l\'élève'
		}

		res.redirect('/gestioneleve/modules')
			
	}
	else {
		req.session.sessionFlash = {
			type: 'error',
			message: 'Vous n\'êtes pas ou plus authentifié, veuillez vous connecter'
		}
		res.redirect('/')
	}

	
});


router.get('/gestioneleve/:name/suppression/:idatelier', (req, res) => {

	if (req.session.rechercheEleve) {

		var delAtelier = 'DELETE FROM ateliersSuivis WHERE id='+req.params.idatelier;

//		console.log(delAtelier);
    	
		connection.query(delAtelier);

//		popup.alert({
		//		Demander confirmation
//		});
		res.redirect('/gestioneleve')
			
	}
	else {
		req.session.sessionFlash = {
			type: 'error',
			message: 'Vous n\'êtes pas ou plus authentifié, veuillez vous connecter'
		}
		res.redirect('/')
	}

	
});


router.get('/logout', (req, res) => {

//	req.session.sessionFlash = {
//		type: 'info',
//		message: 'Vous avez bien été déconnecté!'
//		}
//  	res.send("you've been logged out!");

//	req.flash('info', 'Vous avez bien été déconnecté!');
	req.session.destroy();
	res.redirect('/');
});


// Ecoute sur le port 8080

app.use('/', router);

http.listen(8080, () => {
    console.log('Listening on localhost:8080');
})
