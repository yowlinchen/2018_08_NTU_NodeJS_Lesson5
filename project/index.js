// load express package 
let express = require("express");
let parser = require("body-parser");

// init firebase package
let admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lesson3-b425f.firebaseio.com"
});

// Estbalish connection with database
let database = admin.database();

// create applicatoin object
let app = express();
// create static website
app.use(express.static("www"));

// establish 接受 post 方法參數的能力
app.use(parser.urlencoded({
    extended: true
}));

// use post method to take care of /post
app.post("/post", function (req, res) {
    res.send("OK");
});

app.listen(3000, function () {
    console.log("Server Started");
});