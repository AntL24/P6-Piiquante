const mongoose = require('mongoose');

//Installation de bcryptjs et non bcrypt pour éviter une erreur.
const password = process.env.DB_PASSWORD; 
const username = process.env.DB_USERNAME;


//String interpolation pour mettre dans le string les variables username et password (dont les valeurs sont dans .env).
const uri = `mongodb+srv://${username}:${password}@cluster0.jldwp.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(uri)
    .then((() => console.log("Connected to MongoDB")))
    .catch((err) => console.log("Error connecting to Mongo:", err));

//Exporting mongoose object, so that it can be used in other js files.
module.exports = {mongoose}