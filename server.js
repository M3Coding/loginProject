import express from 'express';
import bodyParser from 'body-parser';
import pg from "pg";
import bcrypt from "bcrypt";
import "dotenv/config";
import session from "express-session";
import passport from "passport";
import {Strategy} from "passport-local";



dotenv.config({ path: '/.env' })
const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUnititialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    }
})
);

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client( {
    database: "testUsers",
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: process.env.dbPassword,

});
db.connect();

const insert = (fname, lname, username, email, password) => {
    bcrypt.hash(password, saltRounds, async(err, hash) => {
        if (err) throw err;
        await db.query("INSERT INTO users (fname, lname, username, email, password) VALUES ($1, $2, $3, $4, $5)", [fname, lname, username, email, hash]);
    });
    
} //insert into db and add hash function for password

let verification = async(user, pass) => {
    
 }
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    console.log(req.user);//check to see if user is authenticated.
    if(req.isAuthenticated()) {
        res.render("index.ejs");
    } else {
        res.render("/login")

    }
    ;
})

//Register Server
app.post("/submitRegister", (req, res) => {
    let firstName= req.body.fname;
    let lastName= req.body.lname;
    let user= req.body.registeredUser;
    let pass= req.body.userPassword;
    let userEmail= req.body.email;
    
    

    // object gets the user information from registration page. 

    insert(firstName, lastName, user, userEmail, pass);//test logic to see if properly gathering information. 
    res.render("register.ejs")
})
//Login Server
app.post("/submitLogin", passport.authenticate("local", { 
    successRedirect:"/",
    failureRedirect:"/login",

}));

//Triggers every time it tries to authenticate user
passport.use(new Strategy(async function verify(username, password, cb) {
    try{
    let result = await db.query("SELECT * FROM users WHERE username=$1", [username]);
    let userInfo = result.rows[0];
    console.log(userInfo);
    if (!userInfo) {
        console.log("User not found!");
        return false; 
    } 
    const match = await bcrypt.compare(pass, userInfo.password);
    if (match) {
        return cb(null, user)
    } else {
        return cb(null, user)
    }

    }catch(err) {
        return cb("User Verification failed:", err);
    }; //check if the login information stored is matching what the user is putting in. Hardcoded object with login information. 
}))
//Next steps. add postgres database to recieve registration and check it with login screen. 

passport.serializeUser((user, cb) => {
    cb(null, user);
});//save users information in local session for access

passport.deserializeUser((user, cb) => {
    cb(null, user)
});//to get user it access user information through that session 
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})