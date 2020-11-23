const { check } = require('express-validator')
const userRepo = require('../../repositories/users')

module.exports = {
    emailValidation:check('email')
        .exists({checkNull: true, checkFalsy: true})
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Email is invalid")
        .custom( async email => {
            const existingUser = await userRepo.getOneBy({email});
            if(existingUser){
                throw new Error("That email is already associated with another account.")
            }
        }),
    passwordValidation:check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters long"),
    confirmPasswordValidation:check('confirmPassword')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("Password must be between 4 and 20 characters long")
            .custom((confirmPassword, { req }) => {
                if(confirmPassword !== req.body.password){
                    throw new Error("Passwords must match");
                }
                return true;
            }),
    requireExistingEmail:check('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .custom(async email => {
            const user = await userRepo.getOneBy({ email })

            if(!user){
                throw new Error("Email not found")
            }
            return true;
        }),
    requireCorrectCredentials:check('password')
        .trim()
        .custom(async (password, { req }) => {
            const { email } = req.body;
            const user = await userRepo.getOneBy({email});
            
            if(!user){
                throw new Error("Invalid Password")
            }

            const samePassword = await userRepo.comparePasswords(user.password, password);
            if (!samePassword){
                throw new Error("Invalid Password")
            }
            
            return true;
        })
}