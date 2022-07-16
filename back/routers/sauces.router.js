const express = require('express');
const {makeSauces, sendSauces, sendSauceCorrespondingToId, deleteSauce, modifySauce, likeSauce} = require("../controllers/sauces");
const {authenticateUser} = require("../middleware/authenticate");//authenticateUser will verify user informations (header, password, token)
const {matchingUserID} = require("../middleware/matchingUserID");
const {upload} = require('../middleware/multer');
const saucesRouter = express.Router();
const bodyParser = require('body-parser');

saucesRouter.use(bodyParser.json());
saucesRouter.use(authenticateUser);//Refactoring : .use with authenticateUser instead of calling it directly within each request

saucesRouter.get("/", sendSauces);
saucesRouter.post("/", upload.single("image"), makeSauces);
saucesRouter.get("/:id", sendSauceCorrespondingToId);
saucesRouter.delete("/:id", matchingUserID, deleteSauce);
saucesRouter.put("/:id", matchingUserID, upload.single("image"), modifySauce);
saucesRouter.post("/:id/like", likeSauce);

module.exports = {saucesRouter} 

