const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

//Function to verify user when login. Verify header, token, and password.
//It's a middleware. Hence, will take a third argument, "next", which will call next function
//if all goes well. Else, it'll stop.
function authenticateUser(req, res, next){
    console.log("Authenticating user...")
    const header = req.header("Authorization");
    if (header == null) return res.status(403).send({ message: "Invalid authorization header" });
    
    const token = header.split(" ")[1];
    if (token == null) return res.status(403).send({ message: "Token is required" });
    //Verifying the token with JWT before logging in. 
    jwt.verify(token, process.env.JWT_PASSWORD, (err) => {
        //Err va intercepter les mauvais tokens et les tokens expirés.
        if (err) return res.status(403).send({message : "Token invalid" + err})
        console.log("Token is valid.")
        next()
    })
}

module.exports = {authenticateUser};