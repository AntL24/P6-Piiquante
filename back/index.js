//On importe les variables d'environnement dans le fichier index.js
require('dotenv').config();

const express = require('express');
const app = express();
const corsMiddleware = require("cors"); //Cors intervient entre la requête et la réponse pour ajouter des headers.
const port = 3000;

///////////////////////
//Database connection//
///////////////////////
require("./mongo");

//////////////
//Controllers/
//////////////
const {saveNewUser} = require("./controllers/users");
const {loginUser} = require("./controllers/users");

//////////////
//Middleware//
//////////////
//Permet de définir un middleware qui va définir des headers pour les requêtes.
app.use(corsMiddleware())
//express.json permet de récupérer les données envoyées dans le body de la requête.
app.use(express.json())

//////////
//Routes//
//////////
app.post("/api/auth/signup", saveNewUser);
app.post("/api/auth/login", loginUser);
//app.get (l'application va réagir à la méthode get),
//CàD que lorsqu'on reçoit une requête (req) sur l'url globale /, on va executer la fonction (res)
app.get('/', (req, res) => {
    res.send('Hello World!')
   }
)

//////////
//Listen//
//////////
//On demande à l'app d'écouter sur le port 3000, et de lancer un message
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
    }
)