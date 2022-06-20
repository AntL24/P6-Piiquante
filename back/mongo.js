const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Installation de bcryptjs et non bcrypt pour éviter une erreur.
const password = process.env.DB_PASSWORD; 
const username = process.env.DB_USERNAME;


//String interpolation pour mettre dans le string les variables username et password (dont les valeurs sont dans .env).
const uri = `mongodb+srv://${username}:${password}@cluster0.jldwp.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(uri)
    .then((() => console.log("Connected to MongoDB")))
    .catch((err) => console.log("Error connecting to Mongo:", err));

//Mongoose fonctionne avec des schémas.
//On crée un schéma pour exiger des utilisateurs un email unique et un mot de passe assez compliqué de minimum 8 caractères
//avec au moins un chiffre et un caractère spécial (caractères non-verbaux valant caractère spécial).
const userSchema = new mongoose.Schema({
    email: {type: String, required : true, unique : true},
    password: {type: String, required : true, minlength : 6, maxlength : 255, match : /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/}
});
//On ajoute un plugin pour vérifier que l'email est unique. 
//?Pourquoi le message d'erreur ne s'affiche que dans la response de l'onglet network, et pas sur la page web ?
userSchema.plugin(uniqueValidator);

//Création d'un modèle qui suit UserSchema pour les utilisateurs.
const User = mongoose.model('User', userSchema);

//On exporte pour pouvoir utiliser le modèle dans le fichier index.js
module.exports = {mongoose, User};