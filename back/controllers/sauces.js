const mongoose = require('mongoose');
const { unlink } = require("fs/promises"); //using fs-promises because it is called within promises, so it is asynchronous code.

const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper : String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
    }
)

const Product = mongoose.model('Product', productSchema)

//sendSauces will send all products to display on the page "all sauces".
function sendSauces(req, res){
    Product.find({})
        .then((products) => res.send(products))
        .catch((error) => res.status(500).send(error));
    }
//getSauce is called inside the next function, it will return a particular product, matching the id of request params.
function getSauce( req, res){
    const { id } = req.params
    return Product.findById(id)
}
//sendSauceCorrespondingToId will take the product return by getSauce, before checking if it exists in the database
//and finally sending it to display on the specific page.
function sendSauceCorrespondingToId(req, res) {
    getSauce(req, res)
    .then((product) => sendResponseToClient (product, res))
    .catch((err)=> res.status(500).send(err));
}
//deleteSauce will select in our database the product with the id matching our request params, 
function deleteSauce( req, res){
    const { id } = req.params;
    //1) Request to delete is sent to Mongo
    Product.findByIdAndDelete(id)
        //We get our response from the MongoDB.
        .then((product) =>  sendResponseToClient(product, res))
        //Local file in images folder is deleted.
        .then((item) => deleteImage(item))
        //Success console.log.
        .then((res) => console.log("File deleted successfully", res))
        //Catch with status 500 and error message.
        .catch((err) => res.status(500).send({message: "deleteSauce failed", err}))
}
function modifySauce(req, res) {
    const {params : {id}} = req;//Params id = request id.
    const isThereANewImage = req.file != null;//isThereANewImage is a variable that checks true if user has uploaded a new image.
    const payload = createPayload(isThereANewImage, req)//payload is created from the function createPayload.
        //If there is no new image, it immediately returns the request body with no modification.
        //If there is a new image, it will update the Payload with the new image before returning it.
    Product.findByIdAndUpdate(id, payload)//id is then used to select the product to update inside our database, and payload is used to give the new content.
        .then((dbresponse) => sendResponseToClient(dbresponse, res))
        .then((prod) => deleteImage(isThereANewImage, prod))
        .then((res) => console.log("File deleted successfully", res))
        .catch((err) => console.error("Cannot update", err))
}
//createPayload will update the payload with the new image path ONLY IF there is a new image provided within the request body.
function createPayload(isThereANewImage, req){
    //Checking if user has provided us a new image to replace the old one. If not, request body is returned.
    if (!isThereANewImage) return req.body
    //User has indeed provided us with a new image.
    const payload = JSON.parse(req.body.sauce)//We parse the payload from the request body of the sauce.
    //Using createImageUrl function to get the new imageUrl from the request fileName.
    payload.imageUrl = createImageUrl(req, req.file.fileName)//We then replace the old imageUrl with the new inside the existing payload.
    return payload //Payload is returned.
}
//function to create imageUrl for new sauce
  function createImageUrl(req, fileName){
    return req.protocol + "://" + req.get("host") + "/images/" + fileName
}
//This function will  make sure the product is present in our database before returning it.
function sendResponseToClient(product, res){
    //If we do not find the selected product in the DB, error 404 is returned.
    if (product==null) {
        console.log("Function sendResponseToClient, No material found in DB to update")
        return res.status(404).send({message : "No material found in DB to update"})
    }
    //We found the selected product in the DB. Product is returned with a response "status 200".
    console.log("Function sendResponseToClient, Updating:", JSON.stringify(product));
    //Promise.resolve allow us to use a .then to pass, within a promise, the product found in DB.
    return Promise.resolve(res.status(200).send(product)).then(() => product)
}
//deleteImage will delete the image ONLY if product in not null.
function deleteImage(newImg, product){
    //console.log("Function deleteImage starting. Product received from sendResponseToClient=" + JSON.stringify(product))
    if (!newImg) return //Checking if a new image was upload by user. If not, return immediately.
    if (product == null) return //Checking if the product returned by mongoo with sendResponseToClient is null.
    const fileToDelete = product.imageUrl.split("/").at(-1);//Selecting the imageUrl of the product. "at(-1)"" counts one from the end of the array.
    return unlink ("images/" + fileToDelete ) //Using unlink to delete our file in "images" folder.
}

function makeSauces(req, res){
    const {body, file} = req;
    const {fileName} = file
    const sauce = JSON.parse(body.sauce);
    const {userId, name, manufacturer, description, mainPepper, heat} = sauce;
    const product = new Product({
        userId,
        name,
        manufacturer,
        description,
        mainPepper,
        imageUrl: createImageUrl(req, fileName),
        heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        userDisliked: []
    })
    product
    .save()
    .then((message)=> {
       res.status(201).send({ message})
    })
    .catch((err) => res.status(500).send(err));
}

//LIKES & DISLIKES FUNCTIONS
function likeSauce (req, res) {
    const {like, userId} = req.body;
    if (![0, -1, 1].includes(like)) return res.status(403).send({message : "Like request is invalid : incorrect value"}); //Bad values are immediately rejected.
    getSauce(req, res)
        //Calling updateVoteCounter to 
        .then((product) => updateVoteCounter(product, like, userId, res))
        //Saving product on server?
        .then((product) => product.save() )
        //Using sendResponseToClient to 
        .then((product) => sendResponseToClient(product, res))
        //If err, we send it back with a status 500.
        .catch((err) =>  res.status(500).send(err));
}

function updateVoteCounter( product, like, userId, res){
    if (like === 1 || like === -1) return incrementVoteCounter(product, userId, like)
    /*if (like === 0)*/ return setVoteToZero(product, userId, res)
}

function setVoteToZero(product, userId, res) {
    const { usersLiked, usersDisliked } = product

    //On gère les cas d'erreur avant toute autre chose.
    if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
    //Forcing catch with Promise.reject
    return Promise.reject("A given user cannot register both dislikes and likes on the same product")

    if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
    return Promise.reject("cannot register 0 vote");

    //On enlève le userId de l'array sélectionné
    if (usersLiked.includes(userId)) {
        --product.likes;
        product.usersLiked = product.usersLiked.filter((id) => id !== userId)
    }else{
        --product.dislikes;
        product.usersDisliked = product.usersDisliked.filter((id) => id !== userId)
    }
    //On renvoie le produit.
    return product
}

function incrementVoteCounter(product, userId, like){
    const {usersLiked, usersDisliked} = product;
    const usersArray = like === 1 ? usersLiked : usersDisliked;    //Is like equal to one ? If yes, usersArray = usersLiked, if not it's equal to usersDisliked.
    if (usersArray.includes(userId)) return product    //If userId is already inside the array, product is returned immediately.
    usersArray.push(userId);    //If not, we push UserId in the array, and we increment the product likes (or dislikes) before returning.
    like === 1 ? ++product.likes : ++product.dislikes;
    return product;
}
module.exports = {sendResponseToClient, getSauce, sendSauces, makeSauces, sendSauceCorrespondingToId, deleteSauce, modifySauce, likeSauce}
