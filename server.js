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
app.post("/submit", (req, res) => {
    let userInput = req.body.username;
    let userPass = req.body.password;

console.log(userInput, userPass);//check if the userinput is being parsed to the server. Check is successful.

if (userInput == loginInfo.username && userPass == loginInfo.password) {
    console.log("Login Successful");
} else {
    console.log("Login unsuccessful");
}
//check if the login information stored is matching what the user is putting in. Hardcoded object with login information. 

})

//Next steps. add postgres database to recieve registration and check it with login screen. 

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})