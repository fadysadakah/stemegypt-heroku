var express = require("express"), app = express(), request = require("request"), bodyParser = require("body-parser"); 
 app.use(bodyParser.urlencoded({ extended: !1 })), app.use(express.static("public")); 
 const PORT = process.env.PORT || 5e3; 
app.set("view engine", "ejs"), app.get("/", function (req, res) {
    
    res.render("index")
}), app.get("*", function (req, res) { res.status(404); res.render("error"); }), app.listen(PORT, function () { console.log("Server Started") }); 
