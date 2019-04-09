const PORT = process.env.PORT || 5001;
var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: !1 }));
app.use(express.static("public"));
var cookieParser = require('cookie-parser')
app.use(cookieParser());
var name = ' ';
const pg = require('pg');
const client = new pg.Client({
    user: 'teidrwobeixtbr',
    password: 'a0b3c5b9951e160027ffff161c6a95d5e0849dda568d494377504d0cad6d7794',
    database: 'dfmorpksdk0uhp',
    port: 5432,
    host: 'ec2-23-23-195-205.compute-1.amazonaws.com',
    ssl: true
});

////////////////////////////////////////////////////////////////////////////////
client.connect();











app.set("view engine", "ejs");


app.get("/", function (req, res) {
   
    var email = req.cookies['email'];
    var password = req.cookies['password'];

    if (email != undefined && password != undefined) {

        const query = client.query("SELECT * FROM users where email='" + email + "' AND password='" + password + "'", (err, RES) => {
            if (err) throw err
            if (RES.rows.length != 0) {
                first_name = RES.rows[0].first_name;
                last_name = RES.rows[0].last_name;
                res.render("index", { name: first_name });
            } else {
                res.redirect("/signin");
            }
            // client.end();
        });
    }
    else {
        res.render("index", { name: ' ' })
    }
});



app.get("/signup", function (req, res) {

    res.render("sign_up")
});
app.get("/signin", function (req, res) {

    res.render("sign_in")
});


app.post("/signup", function (req, res) {

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;
    const query = client.query("insert into users(first_name, last_name, email, password) VALUES ('" + first_name + "', '" + last_name + "', '" + email + "', '" + password + "')", (err, RES) => {
        if (err) { throw err }
        else {
            res.cookie('email', email);
            res.cookie('password', password);
            res.redirect("/");
        }
       
    });
    console.log(first_name);

});

app.post("/signin", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var first_name;
    var last_name;
  
    const query = client.query("SELECT * FROM users where email='" + email + "' AND password='" + password + "'", (err, RES) => {
        if (err) throw err

        if (RES.rows.length != 0) {
            first_name = RES.rows[0].first_name;
            last_name = RES.rows[0].last_name;
            suc = true;
            res.cookie('email', email);
            res.cookie('password', password);
            res.redirect("/");
            console.log('gggggggggg')
        } else {
            res.redirect("/signin");
        }
   
    });


});


app.get("*", function (req, res) {
    res.status(404);
    res.render("error");
});



app.listen(PORT, function () {
    console.log("Server Started")
});

function cleient_connect() {

}