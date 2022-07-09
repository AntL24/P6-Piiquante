
//////////////
//Controllers/
//////////////
const {saveNewUser, loginUser} = require("../controllers/users");

const express = require('express');
const authRouter = express.Router();

authRouter.post("/signup", saveNewUser);
authRouter.post("/login", loginUser);

module.exports = {authRouter}