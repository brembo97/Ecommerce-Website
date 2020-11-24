const express = require('express');
const {validationResult} = require('express-validator');

const userRepo = require('../../repositories/users');
const signUpTemplate = require('../../views/admin/auth/signUpTemplate');
const signInTemplate = require('../../views/admin/auth/signInTemplate');
const { emailValidation,
        passwordValidation,
        confirmPasswordValidation,
        requireExistingEmail,
        requireCorrectCredentials } = require('./validation');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signUpTemplate({ req }))
})

router.post('/signup', [
        emailValidation,
        passwordValidation,
        confirmPasswordValidation,
    ], 
    async (req, res) => {
        const {email, password, confirmPassword} = req.body;
        
        //Check for validation errors
        const errors = validationResult(req);
        console.log(errors)

        if(!errors.isEmpty()){
            return res.send(signUpTemplate({ req, errors }))    
        }
        
        //Create user with sanitized info
        const user = await userRepo.createUser({email, password});
        req.session.id = user.id;
        res.send("Account Created");
})

router.get('/signin', (req, res) =>{
    res.send(signInTemplate({}))
})

router.post('/signin', [
    requireExistingEmail,
    requireCorrectCredentials
    ],
    async (req, res) => {

    //User authentication
    const errors = validationResult(req)
    console.log(errors)

    //Invalid credentials
    if(!errors.isEmpty()){
        return res.send(signInTemplate({ errors }))
    }

    //Correct credentials, login
    const user = await userRepo.getOneBy({email: req.body.email})
    req.session.id  = user.id;
    res.send("Success login in!!");
    
})

router.get('/signout', (req, res) => {
    req.session = null;
    
    res.redirect('/signin');
})

module.exports = router;