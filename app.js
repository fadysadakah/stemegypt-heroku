const PORT = process.env.PORT || 5001;
var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: !1 }));
app.use(express.static("public"));
var name= ' ';

///////////////////////////////////////////////////////////////////////
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://teidrwobeixtbr:a0b3c5b9951e160027ffff161c6a95d5e0849dda568d494377504d0cad6d7794@ec2-23-23-195-205.compute-1.amazonaws.com:5432/dfmorpksdk0uhp';

const client = new pg.Client({
    user: 'teidrwobeixtbr',
    password: 'a0b3c5b9951e160027ffff161c6a95d5e0849dda568d494377504d0cad6d7794',
    database: 'dfmorpksdk0uhp',
    port: 5432,
    host: 'ec2-23-23-195-205.compute-1.amazonaws.com',
    ssl: true
}); 

// query.on('end', () => { client.end(); });

////////////////////////////////////////////////////////////////////////////////









app.set("view engine", "ejs");


app.get("/", function (req, res) {

    res.render("index",{name:name})
});



app.get("/signup", function (req, res) {

    res.render("sign_up")
});
app.get("/signin", function (req, res) {

    res.render("sign_in")
});


app.post("/signup", function (req, res) {
    const client = new pg.Client({
        user: 'teidrwobeixtbr',
        password: 'a0b3c5b9951e160027ffff161c6a95d5e0849dda568d494377504d0cad6d7794',
        database: 'dfmorpksdk0uhp',
        port: 5432,
        host: 'ec2-23-23-195-205.compute-1.amazonaws.com',
        ssl: true
    }); 
    client.connect();
    var first_name=req.body.first_name;
    var last_name=req.body.last_name;
    var email=req.body.email;
    var password=req.body.password;
    const query = client.query("insert into users(first_name, last_name, email, password) VALUES ('" + first_name + "', '" + last_name + "', '" + email + "', '" + password + "')", (err, res) => {
        if (err) throw err
        console.log(res)
        client.end();
    });
    console.log(first_name);
    res.redirect("/")
   
});

app.post("/signin", function (req, res) {
    var email=req.body.email;
    var password=req.body.password;
    const client = new pg.Client({
        user: 'teidrwobeixtbr',
        password: 'a0b3c5b9951e160027ffff161c6a95d5e0849dda568d494377504d0cad6d7794',
        database: 'dfmorpksdk0uhp',
        port: 5432,
        host: 'ec2-23-23-195-205.compute-1.amazonaws.com',
        ssl: true
    }); 
    client.connect();
    const query = client.query("SELECT * FROM users where email='" + email + "' AND password='" + password + "'", (err, res) => {
        if (err) throw err
        console.log(res.rows[0].first_name)
        name = res.rows[0].first_name;
        client.end();
    });
    res.redirect("/")
});


app.get("*", function (req, res) {
    res.status(404);
    res.render("error");
});



app.listen(PORT, function () {
    console.log("Server Started")
});