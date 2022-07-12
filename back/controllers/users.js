

const {User} = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

///////////////////////////
//Fonction pour le signup//
///////////////////////////
async function saveNewUser(req, res) {
    try {
    const { email, password } = req.body;
    const hashedPassword = await passwordHasher(password);
    const user = new User({email, password: hashedPassword});
    await user.save();
    res.status(201).send({message: "User created"})
    } catch (err) {
        res.status(409).send({message: "Error creating user: " + err})
    }
}

//////////////////////////
//Fonction pour le login//
//////////////////////////
async function loginUser(req, res) {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({email: email})
    const userId = user._id
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send({message: "Invalid credentials"});
    }
    console.log("userId1", userId)
    const token = createToken(userId)
    res.status(200).send({userId : user._id, token : token})
    } catch (err) {
    res.status(500).send({message: "Error logging in: " + err})
    }
}

 function createToken(userId, email) {
    console.log("userid2", userId)
    const jwtPassword = process.env.JWT_PASSWORD;
    return jwt.sign({userId: userId}, /*Callback is not a function {email: email},*/ jwtPassword, {expiresIn: "24h"}); //return token
}

//Fonction pour encrypter le mot de passe
function passwordHasher(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds)
}

//On exporte pour pouvoir l'utiliser dans le fichier index.js
module.exports = {saveNewUser, loginUser};



//Pour supprimer tous les utilisateurs de la base de donnée :
//User.deleteMany({}).then(() => console.log("All users deleted"));