const express = require('express');

// création du serveur
const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/accueil.html')
});

// Ecoute sur le port 
app.listen(8080, () => {
    console.log('Listening on localhost:8080');
})
