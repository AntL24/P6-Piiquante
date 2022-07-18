
//UniqueValidator is used to ensure email addresses are specific to all users.

const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');
require ("../mongo");

//Mongoose fonctionne avec des schémas.
//On crée un schéma pour exiger des utilisateurs un email unique
const userSchema = new mongoose.Schema({
    email: {type: String, required : true, unique : true},
    password: {type: String, required : true, minlength : 6, maxlength : 255}
});
//On ajoute un plugin pour vérifier que l'email est unique. 
userSchema.plugin(uniqueValidator);

//Création d'un modèle qui suit UserSchema pour les utilisateurs.
const User = mongoose.model('User', userSchema);
//On exporte pour pouvoir utiliser le modèle dans le fichier index.js
module.exports = {User};