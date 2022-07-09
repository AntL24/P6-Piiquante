const mongoose = require("mongoose");
const { unlink } = require("fs/promises"); //using fs-promises because it is called within promises, so it is asynchronous code.
const {likeSauce} = require("./vote");


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
const Product = mongoose.model("Product", productSchema);

//Function sendSauces will send a list of products (if header and token are valid, otherwise it will return an error message.)
function sendSauces(req, res){
    console.log("Sending sauces...");
    Product.find({})
        .then(products => res.send(products))
        .catch((error) => res.status(500).send(error));
    console.log("Sauces sent!");
    }

function getSauce( req, res){
    const { id } = req.params
    Product.findById(id)
}

function sendSauceCorrespondingToId( req, res) {
    console.log("Sending selected Sauce...");

    getSauce(req, res)   
    .then(product => manageUpdateResponse (product, res))
    .catch((err)=> res.status(500).send(err));

    console.log("Sauce sent!");
}

function deleteSauce( req, res){
    const { id } = req.params;
    //1) Request to delete is sent to Mongo
    Product.findByIdAndDelete(id)
        .then(product =>  manageUpdateResponse(product, res))
        .then((item) => deleteImage(item))
        .then((res) => console.log("File deleted successfully", res))
        .catch((err) => res.status(500).send({message: err}))
}

function modifySauce(req, res) {
    const { params : { id } } = req;
    //Boolean variable with lax equality to manage the case where img do not exist anymore on the server side
    // == ?
    const isThereANewImage = req.file != null 
    const payload = createPayload(isThereANewImage, req)
    //UPDATING DATABASE
    Product.findByIdAndUpdate(id, payload)
    .then((DBResponse)=> manageUpdateResponse(DBResponse, res))
    .then((product) => deleteImage(product))
    .then((res) => console.log("File deleted successfully", res))
    .catch((err)=>console.error("Cannot update", err))
}
function deleteImage(product){
    if (product == null) return
    console.log("Product to delete : ", product)
    //Using imageUrl to get the name of the image to delete on the server. (at-1) counts one from the end of the array.
    const fileToDelete = product.imageUrl.split("/").at(-1)
    return unlink ("images/" + fileToDelete )
}

function createPayload(isThereANewImage, req){
    if (!isThereANewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = createImageUrl(req, req.file.fileName)
    console.log("Payload:", payload)
    return payload
}

//Function to manage UpdateResponse in case of no material in DB
function manageUpdateResponse(product, res){
    //lax equality? 
    if (product==null) {
        console.log("No material found in DB to update")
        return res.status(404).send({message : "No material found in DB to update"})
    }
    console.log("Updating", product)
    //Promise.resolve allow use to use a .then to pass product after the response
    return Promise.resolve(res.status(200).send(product)).then(() => product)
}
 //function to create imageUrl for new sauce
  function createImageUrl( req, fileName){
    return req.protocol + "://" + req.get("host") + "/images/" + fileName
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
       res.status(201).send({message : message})
       return console.log("product registered", message)
    })
    .catch(console.error)
}



module.exports = {manageUpdateResponse, getSauce, sendSauces, makeSauces, sendSauceCorrespondingToId, deleteSauce, modifySauce, likeSauce}
