
const jwt = require("jsonwebtoken");
require('dotenv').config();

async function matchingUserID (req, res, next) {
    try {                                                             
        const token = req.headers.authorization.split(' ')[1]; // Selecting the token part of the headers
        const decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);//Verifying the token with our dotenv password.
        const userId = decodedToken.userId;  //Selecting the userId
        const productuserId = req.body.userId;
        console.log ("token:", token, "DecodedToken:", decodedToken, "userId:", userId, "productuserId", productuserId);                           
        if (req.body.userId && req.body.userId !== userId) {                        
          throw Error;                                                
        } else {
          console.log("userId of product:", productuserId, "matches userId of user :", userId);
          req.token = token;//Pourquoi ai-je besoin de lui repasser le token et l'userId ?
          req.user = userId;//Sans cela, j'obtiens l'erreur "cannot set headers before they are sent to the client"
          next();      
        }
      } catch {
        res.status(401).json({error:error});                            
      }
    };
module.exports = {matchingUserID}