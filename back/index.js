const {app, express} = require("./server");
const {saucesRouter} = require("./routers/sauces.router");//We're using a router instance to set a default path.
const {authRouter} = require("./routers/auth.router");
const bodyParser = require("body-parser");
const port = 3000;
const path = require('path');

///////////////////////
//Database connection//
require("./mongo");

//////////////////////////////////////////////////////////////////////////////////////////
//Middleware : authenticateUser will verify user informations (header, password, token).//
app.use(bodyParser.json());
app.use("/api/sauces", saucesRouter);
app.use("/api/auth", authRouter)

//////////
//Listen//
//Authorization to see images folder on back server.
app.use("/images", express.static(path.join(__dirname, "images")));
//On demande à l'app d'écouter sur le port 3000, et de lancer un message
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
    }
)