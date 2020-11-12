const express = require('express');
const nodemon = require('nodemon');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method="post">
                <input name="email" placeholder="Email"/>
                <input name="password" placeholder="Password"/>
                <input name="confirmPassword" placeholder="Confirm your Password"/>
                <button>Sign Up</button>
            </form>
        <div>
    `)
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.send("Account Created");
})


app.listen(3000, () => {
    console.log("Listening on port 3000")
});