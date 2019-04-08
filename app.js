var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: !1 }));

app.use(express.static("public"));

const PORT = process.env.PORT || 5001;



app.set("view engine", "ejs");


app.get("/", function (req, res) {

    res.render("index")
});



app.get("/signup", function (req, res) {

    res.render("sign_up")
});


app.post("/signup", function (req, res) {

    res.render("sign_up")
});


app.get("*", function (req, res) {
    res.status(404);
    res.render("error");
});



app.listen(PORT, function () {
    console.log("Server Started")
});