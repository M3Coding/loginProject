import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

const loginInfo = {
    username: "Meady",
    password: "Anewme2011", 
    email: "meady2009@gmail.com"
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/submit", (req, res) => {
    let userInput = req.body.username;
    let userPass = req.body.password;

console.log(userInput, userPass);//check if the userinput is being parsed to the server. Check is successful.

if (userInput == loginInfo.username && userPass == loginInfo.password) {
    console.log("Login Successful");
} else {
    console.log("Login unsuccessful");
}


})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})