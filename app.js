var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: !1 }));
app.use(express.static("public"));
var cookieParser = require('cookie-parser')
app.use(cookieParser());
const pg = require('pg');
var md5 = require('md5');
var alert =false;
app.set("view engine", "ejs");
const PORT = process.env.PORT || 80;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const client = new pg.Client({
    user: 'teidrwobeixtbr',
    password: 'a0b3c5b9951e160027ffff161c6a95d5e0849dda568d494377504d0cad6d7794',
    database: 'dfmorpksdk0uhp',
    port: 5432,
    host: 'ec2-23-23-195-205.compute-1.amazonaws.com',
    ssl: true
});

client.connect();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/terms", function (req, res) {
    res.render('terms',{is_signed_in:false})
})

app.get("/", function (req, res) {

    var email = req.cookies['email'];
    var password = req.cookies['key'];

    if (email != undefined && password != undefined) {

        const query = client.query("SELECT * FROM users where email='" + email + "'", (err, RES) => {
            if (err) console.log(err.detail);

            if (RES.rows.length != 0) {
                first_name = RES.rows[0].first_name;
                last_name = RES.rows[0].last_name;
                var passworddb = md5(RES.rows[0].password);
                if (passworddb == password) {

                    res.render("index", { name: first_name, is_signed_in: true });

                } else {
                    res.redirect("/signin");

                }
            } else {
                res.redirect("/signin");
            }
            // client.end();
        });
    }
    else {
        res.render("index", { name: ' ', is_signed_in: false })
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get("/signup", function (req, res) {

    res.render("sign_up", { is_signed_in: false ,alert:false})
});
app.get("/signin", function (req, res) {

    res.render("sign_in", { is_signed_in: false })
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/signup", function (req, res) {

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;
    const query = client.query("insert into users(first_name, last_name, email, password) VALUES ('" + first_name + "', '" + last_name + "', '" + email + "', '" + password + "')", (err, RES) => {
        if (err) {
            console.log(err.detail);
            res.render("sign_up", { is_signed_in: false, alert: true })

        }
        else {
            res.cookie('email', email);
            res.cookie('key', md5(password));
            res.redirect("/");
        }

    });
    console.log(first_name);

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post("/signin", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var remember_me = req.body.remember_me;
    if (remember_me == undefined) {

        console.log('remember_me');
    }
    else { }
    var first_name;
    var last_name;

    const query = client.query("SELECT * FROM users where email='" + email + "' AND password='" + password + "'", (err, RES) => {
        if (err) console.log(err.detail);


        if (RES.rows.length != 0) {
            first_name = RES.rows[0].first_name;
            last_name = RES.rows[0].last_name;
            suc = true;
            if (remember_me == undefined) {
                res.cookie('email', email);
                res.cookie('key', md5(password));
            } else {
                res.cookie('email', email, { maxAge: 365 * 24 * 60 * 60 * 1000 });
                res.cookie('key', md5(password), { maxAge: 365 * 24 * 60 * 60 * 1000 });
            }
            res.redirect("/");
        } else {
            res.redirect("/signin");
        }

    });


});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



app.get("/g-signin", function (req, res) {
    
    res.render("partials/google_sign_in");
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("*", function (req, res) {
    res.status(404);
    res.render("error");
});



app.listen(PORT, function () {
    console.log("Server Started")
});
