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

// Take care of signin
app.post("/signin", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // Get datat from Datatbase to check
    let ref = database.ref("/users");
    ref.orderByChild("username").equalTo(username).once("value", function (snapshot) {
        let data = [];
        snapshot.forEach(function (userSnapshot) {
            let value = userSnapshot.val();
            value.key = userSnapshot.key;
            data.push(value);
        });
        // let value = snapshot.val();

        // 從資料中比對密碼
        let user = data.find(function (item) {
            return item.password === password;
        });
        if (user) {
            updateUserTime(user.key);
            res.send(user);
        } else {
            res.send("Failed");
        }
    });
});

function updateUserTime(key) {
    let time = (new Date()).getTime();
    let ref = database.ref("/users/" + key);
    ref.update({
        time: time
    }, function () {});
}

app.post("/signup", function (req, res) {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;
    let time = (new Date()).getTime(); // 1970/1/1 到現在過了幾個毫秒
    // put user info into database
    // Get the parent only
    let ref = database.ref("/users");
    ref.push({
        name: name,
        username: username,
        password: password,
        time: time
    }, function (error) {
        if (error) {
            res.send("Error");
        } else {
            res.send("Ok");
        }
    });
});

app.listen(3000, function () {
    console.log("Server Started");
});