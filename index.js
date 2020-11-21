const express = require('express');
const bodyParser = require('body-parser');
const userRepo = require('./repositories/users.js');
const cookieSession = require('cookie-session');

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieSession({
    name: "session",
    keys: ["azsmqertimzcndqwekdkp"]
}))

app.get('/signup', (req, res) => {
    res.send(`
        <div>
            <h3>${req.session.id}</h3>
            <form method="post">
                <input name="email" placeholder="Email"/>
                <input name="password" placeholder="Password"/>
                <input name="confirmPassword" placeholder="Confirm your Password"/>
                <button>Sign Up</button>
            </form>
        <div>
    `)
})

app.post('/signup', async (req, res) => {
    const {email, password, confirmPassword} = req.body;

    if(await userRepo.getOneBy({email})){
        return res.send("That email is already associated with another account.")
    }

    if(password !== confirmPassword ){
        return res.send("Passwords must be the same")
    }

    const user = await userRepo.createUser({email, password});

    req.session.id = user.id;

    res.send("Account Created");
})

app.get('/signin', (req, res) =>{
    res.send(`
        <div>
            <form method="post">
                <input name="email" placeholder="Email"/>
                <input name="password" placeholder="Password"/>
                <button>Sign In</button>
            </form>
        <div>
    `)
})


app.post('/signin', async (req, res) => {
    
    const {email, password} = req.body;
    
    // User authentication
    const user = await userRepo.getOneBy({email});
    if(!user){
        return res.send("There is no user associated with that email")
    }
    const samePassword = await userRepo.comparePasswords(user.password, password);
    
    if (!samePassword){
        return res.send("Wrong password")
    }

    //User authenticated
    req.session.id  = user.id;
    res.send("Success login in!!");
    
})

app.get('/signout', (req, res) => {
    req.session = null;
    
    res.redirect('/signin');
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
});