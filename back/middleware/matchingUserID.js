
const jwt = require("jsonwebtoken");
require('dotenv').config();

function matchingUserID (req, res, next) {
  const header = req.header("Authorization"); //Making a const out of the authorization header of the request.
  const token = header.split(" ")[1];// Using it to select the token part of the header with split.
  const decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);//Decoding the token with our dotenv password, and putting it into the const decodedToken.
  const userId = decodedToken.userId;  //Selecting the userId part of the token in another const.
  if (req.body.userId && req.body.userId !== userId) return res.status(403).send({ message: "Wrong userId" }); //Making sure userIds match together
  next()
}                          
module.exports = {matchingUserID}