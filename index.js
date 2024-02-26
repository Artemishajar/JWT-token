const express = require("express");
const jwt = require ("jsonwebtoken");
const app = express();

const port = 3101;
//array to store user credentials (email and password)
const users = [
    {
        email: "hajar@gmail.com",
        password: "1234",
    },
    {
        email: "arkx@gmail.com",
        password: "hhjjkk",
    },
];
//middleware to parse incoming requests
app.use(express.json());
//function to generate jwt token based on user email
const generateToken = (email) => {
    const token = jwt.sign({ email: email}, "secret000", { expiresIn: "1000s"});
    return token;
};
//middleware function for authorization
const auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader){
        res.status(401).json("youre not authorized")
}
const token = authHeader.split(" ")[1];
if(!token){
    res.json("token not exist");
}
jwt.verify(token, "secret000", (error, user) => {
    if (error){
        res.status(401).json("youre not authorized")
    }
    console.log("userr", user);
    req.user = user;
});
next();
};
//route for user logging 
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) {
        res.status(401).json({ message: "Email not exist"});
    }
    if (user.password != password){
        res.status(401).json('message: "password incorrect"')
    }
    const token = generateToken(email);
    res.status(200).json(token);
});
// Protected route requiring authentication
app.get("/", auth, (req, res) => {
    res.send(`you are authenticated as ${req.user.email}`);
  });

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});