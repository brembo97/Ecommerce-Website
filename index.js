const express = require('express');
const bodyParser = require('body-parser');
const userRepo = require('./repositories/users.js');

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

app.post('/', async (req, res) => {
    const {email, password, confirmPassword} = req.body;

    if(await userRepo.getOneBy({email})){
        return res.send("That email is already associated with another account.")
    }

    if(password !== confirmPassword ){
        return res.send("Passwords must be the same")
    }

    res.send("Account Created");
})


app.listen(3000, () => {
    console.log("Listening on port 3000")
});