const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')
const userRepo = require('../../repositories/users');
const signUpTemplate = require('../../views/admin/signUpTemplate')
const signInTemplate = require('../../views/admin/signInTemplate')

router.get('/signup', (req, res) => {
    res.send(signUpTemplate({req}))
})

router.post('/signup', [
        check('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage("Email is invalid"),
        check('password')
        .trim()
        .isEmpty()
        .isLength({min:4,max:20})
        .withMessage("Password must be between 4 and 20 characters long")
    ], 
    async (req, res) => {
    const {email, password, confirmPassword} = req.body;
    
    const errors = validationResult(req).array();
    console.log(errors)

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

router.get('/signin', (req, res) =>{
    res.send(signInTemplate())
})


router.post('/signin', async (req, res) => {
    
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

router.get('/signout', (req, res) => {
    req.session = null;
    
    res.redirect('/signin');
})

module.exports = router;