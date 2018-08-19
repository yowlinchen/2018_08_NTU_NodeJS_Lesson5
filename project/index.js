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
    let name = req.body.name;
    let content = req.body.content;
    let time = (new Date()).getTime();
    // Put into database
    let ref = database.ref("/messages");
    ref.push({
        name: name,
        content: content,
        time: time
    }, function (error) {
        if (error) {
            res.send("Error");
        } else {
            res.send("OK");
        }
    });
    // res.send("OK");
});

// use get method to take care of /get
app.get("/get", function (req, res) {
    let time = parseInt(req.query.time);
    let ref = database.ref("/messages");
    ref.orderByChild("time").startAt(time).once("value", function (snapshot) {
        let data = [];
        snapshot.forEach(function (messageSnapShot) {
            data.push(messageSnapShot.val());
        });
        res.send(data);
    });
});

app.listen(3000, function () {
    console.log("Server Started");
});