

const {User} = require('../mongo');//Pour dire que c'est un objet, soit on met des acollades, soit on met .User à la fin
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
    } catch (error) {
        res.status(409).send({message: "Error creating user: " + error})
    }
}


//////////////////////////
//Fonction pour le login//
//////////////////////////
async function loginUser(req, res) {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email})
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        const token = createToken(email)
        res.status(200).send({userId: user?._id, token: token})
    }
    //Refactoring : pas besoin de else.
    //Une fois qu'un res.send est appelé, le code ne continue pas après.
    res.status(401).send({message: "Login failed, please check your password"})
    } catch (error) {
        res.status(500).send({message: "Error logging in, email not found:" + error})
    }
}


function createToken(email) {
    const jwtPassword = process.env.JWT_PASSWORD;
    return jwt.sign({email: email}, jwtPassword, {expiresIn: "24h"}); //return le token
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