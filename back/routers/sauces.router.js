const express = require('express');
const {makeSauces, sendSauces, sendSauceCorrespondingToId, deleteSauce, modifySauce, likeSauce} = require("../controllers/sauces");
//authenticateUser will verify user informations (header, password, token)
const {authenticateUser} = require("../middleware/authenticate");
const {matchingUserID} = require("../middleware/matchingUserID");
const {upload} = require('../middleware/multer');
const saucesRouter = express.Router();
const bodyParser = require('body-parser');

saucesRouter.use(bodyParser.json());
//Refactoring : .use with authenticateUser instead of calling it directly within each request
saucesRouter.use(authenticateUser);



//app.get (l'application va réagir à la méthode get),
//CàD que lorsqu'on reçoit une requête (req) sur l'url globale /, on va executer la fonction (res)
//Restructuration : no need to keep /api/Sauces, since we are now on a default path.
saucesRouter.get("/", sendSauces);
//"AuthenticateUser" is called first, as a condition/confirmation, before any other function is called.
saucesRouter.post("/", upload.single("image"), makeSauces);
saucesRouter.get("/:id", sendSauceCorrespondingToId);
saucesRouter.delete("/:id", matchingUserID, deleteSauce);
saucesRouter.put("/:id", matchingUserID, upload.single("image"), modifySauce)
//Pour modifier une image, si matchingUserID est en premier, j'obtiens "undefined" dans mes console.log(), mais tout marche sans erreur.
//Si matchingUserID vient après upload.single("image"), la modification d'image fonctionne, mais j'obtiens une error :
//"Cannot update [Error: ENOENT: no such file or directory, unlink +"chemin de l'ancienne image", qui a pourtant bien été supprimée.
saucesRouter.post("/:id/like", likeSauce);

module.exports = {saucesRouter} 

