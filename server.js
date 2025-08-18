import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

const loginInfo = {
    username: "JohnDoe",
    password: "12345", 
    email: "JohnDoe@gmail.com"
};
const registeredInfo = {}

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
})

//Register Server
app.post("/submitRegister", (req, res) => {
    let registeredInfo = {
        firstName: req.body.fname,
        lastName: req.body.lname,
        username: req.body.registeredUser,
        password: req.body.userPassword,
        email: req.body.email

    };// object gets the user information from registration page. 

    console.log(registeredInfo);//test logic to see if properly gathering information. 
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