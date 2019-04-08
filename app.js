const PORT = process.env.PORT || 5001;
var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: !1 }));
app.use(express.static("public"));












app.set("view engine", "ejs");


app.get("/", function (req, res) {

    res.render("index")
});



app.get("/signup", function (req, res) {

    res.render("sign_up")
});
app.get("/signin", function (req, res) {

    res.render("sign_in")
});


app.post("/signup", function (req, res) {
    var first_name=req.body.first_name;
    var last_name=req.body.last_name;
    var email=req.body.email;
    var password=req.body.password;

    console.log(first_name);
    res.redirect("/")
});


app.get("*", function (req, res) {
    res.status(404);
    res.render("error");
});



app.listen(PORT, function () {
    console.log("Server Started")
});