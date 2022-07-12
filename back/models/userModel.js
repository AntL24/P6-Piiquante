
//UniqueValidator is used to ensure email addresses are specific to all users.
const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');
require ("../mongo");

//Mongoose fonctionne avec des schémas.
//On crée un schéma pour exiger des utilisateurs un email unique et un mot de passe de minimum 8 caractères
//avec au moins un chiffre et un caractère spécial (caractères non-verbaux valant caractère spécial).
const userSchema = new mongoose.Schema({
    //userId: {type: mongoose.Schema.Types.ObjectId},
    email: {type: String, required : true, unique : true},
    password: {type: String, required : true, minlength : 6, maxlength : 255, match : /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/}
});
//On ajoute un plugin pour vérifier que l'email est unique. 
//?Pourquoi le message d'erreur ne s'affiche que dans la response de l'onglet network, et pas sur la page web ?
userSchema.plugin(uniqueValidator);

//Création d'un modèle qui suit UserSchema pour les utilisateurs.
const User = mongoose.model('User', userSchema);
//On exporte pour pouvoir utiliser le modèle dans le fichier index.js
module.exports = {User};