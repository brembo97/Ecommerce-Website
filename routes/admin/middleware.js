const { validationResult } = require('express-validator');

module.exports = {
    handleValidationError(templateFunction){
        return (req, res, next) => {
            
            const errors = validationResult(req);
            
            if(!errors.isEmpty()){
                return res.send( templateFunction({ errors }));
            }
            next();
        }
    },
    requireAuthorization(req, res, next){
        if(!req.session){
            return res.redirect('/signin')
        }

        next();
    }
}