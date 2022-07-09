
const {getSauce, manageUpdateResponse} = require('./sauces');


function likeSauce (req, res) {
    const {like, userId} = req.body;

    if (![0, -1, 1].includes(like)) return res.status(403).send({message : "Like request invalid"});

    getSauce(req, res)
    .then((product) => updateVoteCounter(product, like, userId, res))
    .then((product) => product.save() )
    .then((product) => manageUpdateResponse(product, res))
    .catch((err) =>  res.status(500).send(err));
}

function updateVoteCounter( product, like, userId, res){
    if (like === 1 || like === -1) return incrementVoteCounter(product, userId)
    /*if (like === 0)*/ return setVoteToZero(product, userId, res)
}

function setVoteToZero(product, userId, res) {
    const { usersLiked, userDisliked } = product
    //On gère les cas d'erreur avant tout autre chose.
    if ([usersLiked, userDisliked].every(arr => arr.includes(userId)))
    //Forcing catch with Promise.reject
    return Promise.reject("A given user cannot register both dislikes and likes on the same product")

    if (![usersLiked, userDisliked].some(arr => arr.includes(userId)))
    return Promise.reject("cannot register 0 vote");

    //On enlève le userId de l'array sélectionné
    if (usersLiked.includes(userId)) {
        --product.likes;
        product.usersLiked = product.usersLiked.filter(id => id !== userId);
    }else{
        --product.dislikes;
        product.usersDisliked = product.usersDisliked.filter(id => id !== userId);
    }
    return product
}

function incrementVoteCounter(product, userId, like){
    const {usersLiked, usersDisliked} = product;

    const usersArray = like === 1 ? usersLiked : usersDisliked;
    if (usersArray.includes(userId)) return product
    usersArray.push(userId);
    like === 1 ? ++product.likes : ++product.dislikes;
    return product;
}

module.exports = {likeSauce}