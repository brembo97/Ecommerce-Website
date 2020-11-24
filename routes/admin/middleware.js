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
    }
}