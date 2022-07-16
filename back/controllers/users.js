

const {User} = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

///////////////////
//Signup function//
///////////////////
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
//////////////////
//Login function//
//////////////////
async function loginUser(req, res) {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({email: email})
    const userId = user._id
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send({message: "Invalid credentials"});
    }
    const token = createToken(userId)
    res.status(200).send({userId : user._id, token : token})
    } catch (err) {
    res.status(500).send({message: "Error logging in: " + err})
    }
}
//Making token out of current userId and our jwtPassword.
function createToken(userId) {
    const jwtPassword = process.env.JWT_PASSWORD;
    return jwt.sign({userId: userId}, jwtPassword, {expiresIn: "24h"}); //return token
}

//Function to encrypt password.
function passwordHasher(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds)
}

module.exports = {saveNewUser, loginUser};



//Pour supprimer tous les utilisateurs de la base de donnée :
//User.deleteMany({}).then(() => console.log("All users deleted"));