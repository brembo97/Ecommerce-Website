const { validationResult } = require('express-validator');

module.exports = {
    handleValidationError(templateFunction, dataCb){
        return async (req, res, next) => {
            
            const errors = validationResult(req);
            
            if(!errors.isEmpty()){

                let product = {};
                if(dataCb){
                    product = await dataCb(req);
                }
                return res.send( templateFunction({ errors, ...product }));
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