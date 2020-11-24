const express = require('express');
const {validationResult} = require('express-validator');

const userRepo = require('../../repositories/users');
const signUpTemplate = require('../../views/admin/auth/signUpTemplate');
const signInTemplate = require('../../views/admin/auth/signInTemplate');
const { emailValidation, passwordValidation, confirmPasswordValidation,
        requireExistingEmail, requireCorrectCredentials } = require('./validation');
const { handleValidationError} = require('./middleware')

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signUpTemplate({ }))
})

router.post('/signup',
    [emailValidation, passwordValidation, confirmPasswordValidation],
    handleValidationError(signUpTemplate),
    async (req, res) => {
        const {email, password} = req.body;
        
        //Create user with sanitized info
        const user = await userRepo.createUser({email, password});
        req.session.id = user.id;
        res.send("Account Created");
})

router.get('/signin', (req, res) =>{
    res.send(signInTemplate({}))
})

router.post('/signin',
    [requireExistingEmail, requireCorrectCredentials],
    handleValidationError(signInTemplate),
    async (req, res) => {
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