import express from 'express';
import bodyParser from 'body-parser';
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;
const db = new pg.Client( {
    database: "testUsers",
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "CodingGenius2023",

});
db.connect();

const insert = (fname, lname, username, email, password) => {
    bcrypt.hash(password, saltRounds, async(err, hash) => {
        if (err) throw err;
        await db.query("INSERT INTO users (fname, lname, username, email, password) VALUES ($1, $2, $3, $4, $5)", [fname, lname, username, email, hash]);
    });
    
} //insert into db and add hash function for password

let verification = async(user, pass) => {
    try{
    let result = await db.query("SELECT * FROM users WHERE username=$1", [user]);
    let userInfo = result.rows[0];
    console.log(userInfo);
    if (!userInfo) {
        console.log("User not found!");
        return false; 
    } 
    const match = await bcrypt.compare(pass, userInfo.password);
    if (match) {
        console.log("Login Successful")
        return true;
    } else {
        console.log("Login Unsuccessful")
        return false;
    }

    }catch(err) {
        console.error("User Verification failed:", err);
        return false;
    }
 }
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
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
app.post("/submitLogin", (req, res) => {
    let userInput = req.body.username;
    let userPass = req.body.password;

verification(userInput, userPass);
//check if the login information stored is matching what the user is putting in. Hardcoded object with login information. 
res.redirect("/")
})

//Next steps. add postgres database to recieve registration and check it with login screen. 

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})