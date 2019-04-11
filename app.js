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
const nodemailer = require("nodemailer");
var crypto = require("crypto");
var alert =false;
app.set("view engine", "ejs");
const PORT = process.env.PORT || 80;
var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,

    auth: {
        user: 'adhamsadakah00@gmail.com',
        pass: 'sublime.css'
    }
});
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

    res.render("sign_up", { is_signed_in: false, alert: false, verfiy: false})
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
    var verfiy_token = crypto.randomBytes(20).toString('HEX');
    client.query("insert into users(first_name, last_name, email, password,isverfied,verfiy_token) VALUES ('" + first_name + "', '" + last_name + "', '" + email + "', '" + password + "','false','"+verfiy_token+"')", (err, RES) => {
        if (err) {
            console.log(err);
            res.render("sign_up", { is_signed_in: false, alert: true, verfiy: false })
            console.log('errrr')
        }
        else {

            send_verfiy_mail(email,verfiy_token);
            res.render("sign_up", { is_signed_in: false, alert: false,verfiy: true })


        }

    });
    console.log(first_name);

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post("/signin", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var remember_me = req.body.remember_me;


    const query = client.query("SELECT * FROM users where email='" + email + "' AND password='" + password + "'", (err, RES) => {
        if (err) console.log(err.detail);


        if (RES.rows.length != 0 && RES.rows[0].isverfied!='false') {
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



app.post("/g-signin", function (req, res) {
   console.log(req.body);});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/verfiy", function (req, res) {

    console.log(req.query.token);
    var verfiy_token=req.query.token;
    if(verfiy_token != undefined){
    client.query("select * from users where verfiy_token='"+verfiy_token+"'", (err, RES) => {
        if (err) {
            console.log(err);
            res.status(404);
            res.render("error");
        }
        else {
            if (RES.rows.length != 1 ) {
                res.status(404);
                res.render("error");
            }else{
                client.query("update users set isverfied='true', verfiy_token=NULL where verfiy_token='" + verfiy_token + "'", (err2, RES2) => {
                    if (err2) {
                        console.log(err2);
                        res.status(404);
                        res.render("error");
                    }else{
                        res.cookie('email', RES.rows[0].email);
                        res.cookie('key', md5(RES.rows[0].password));
                        res.redirect('/')
                    }
                });
            }

        }

    });}
});

app.get("*", function (req, res) {
    res.status(404);
    res.render("error");

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, function () {
    console.log("Server Started")
});

function send_verfiy_mail(email,verfiy_token){
    var mailOptions = {
        from: 'adhamsadakah00@gmail.com',
        to: email,
        subject: 'Stem-Egypt Verfication mail',
        text: 'Hi',
        html: '<tbody><tr style="border-collapse:collapse"> <td valign="top" style="padding:0;Margin:0"> <table class="m_-4741311805250833276es-content" align="center" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%"> <tbody><tr style="border-collapse:collapse"> <table align="center" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff"> <tbody><tr style="border-collapse:collapse"> <td align="left" style="padding:0;Margin:0;padding-top:20px"> <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-spacing:0px"> <tbody><tr style="border-collapse:collapse"> <td align="center" width="600" valign="top" style="padding:0;Margin:0"> <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-spacing:0px"> <tbody><tr style="border-collapse:collapse"> <td align="center" style="padding:0;Margin:0;display:none"></td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr> </tbody></table> <table class="m_-4741311805250833276es-content" align="center" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%"> <tbody><tr style="border-collapse:collapse"> <td align="center" style="padding:0;Margin:0"> <table style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;border-left:1px solid transparent;border-right:1px solid transparent;border-top:1px solid transparent;border-bottom:1px solid transparent" align="center" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff"> <tbody><tr style="border-collapse:collapse"> <td align="left" style="Margin:0;padding-top:20px;padding-bottom:40px;padding-left:40px;padding-right:40px"> <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-spacing:0px"> <tbody><tr style="border-collapse:collapse"> <td align="left" width="518" style="padding:0;Margin:0"> <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-spacing:0px"> <tbody><tr style="border-collapse:collapse"> <td class="m_-4741311805250833276es-m-txt-c" align="center" style="padding:0;Margin:0;padding-bottom:5px"> <img src="https://stem-egypt.herokuapp.com/images/wlogo.png" alt="icon" style="display:block;border:0;outline:none;text-decoration:none" title="icon" width="30"></td> </tr> <tr style="border-collapse:collapse"> <td class="m_-4741311805250833276es-m-txt-c" align="center" style="padding:0;Margin:0"> <h2 style="Margin:0;line-height:29px;font-family:arial,\'helvetica neue\',helvetica,sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#333333">Hey there!<br></h2> </td> </tr> <tr style="border-collapse:collapse"> <td class="m_-4741311805250833276es-m-txt-c" align="center" style="padding:0;Margin:0;padding-top:15px"> <p style="Margin:0;font-size:14px;font-family:arial,\'helvetica neue\',helvetica,sans-serif;line-height:21px;color:#333333">We received a request to set your email to <a href="mailto:hello@name.com" target="_blank">' + email +'</a>. If this is correct, please confirm by clicking the button below. If you don’t know why you got this email, please tell us straight away so we can fix this for you.</p> </td> </tr> <tr style="border-collapse:collapse"> <td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-bottom:15px;padding-top:20px"> <span class="m_-4741311805250833276es-button-border" style="border-style:solid;border-color:#474745;background:#474745;border-width:0px;display:inline-block;border-radius:20px;width:auto"> <a href="https://stem-egypt.herokuapp.com/verfiy?token='+ verfiy_token +'" class="m_-4741311805250833276es-button" style="text-decoration:none;font-family:helvetica,\'helvetica neue\',arial,verdana,sans-serif;font-size:16px;color:#efefef;border-style:solid;border-color:#474745;border-width:6px 25px 6px 25px;display:inline-block;background:#474745;border-radius:20px;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center" target="_blank" data-saferedirecturl="">Confirm Email</a> </span> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr> </tbody></table> <table class="m_-4741311805250833276es-content" align="center" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%"> <tbody><tr style="border-collapse:collapse"> <td align="center" style="padding:0;Margin:0"> <table style="border-collapse:collapse;border-spacing:0px;background-color:transparent" align="center" width="600" cellspacing="0" cellpadding="0"> <tbody><tr style="border-collapse:collapse"> <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"> <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-spacing:0px"> <tbody><tr style="border-collapse:collapse"> <td align="center" width="560" valign="top" style="padding:0;Margin:0">  </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr> </tbody>'
        
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    
}