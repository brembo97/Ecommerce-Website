const express = require('express')
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const newProductTemplate = require('../../views/admin/products/new');
const {titleValidation, priceValidation} = require('../../routes/admin/validation')
const prodRepo = require('../../repositories/products');
const { handleValidationError } = require('./middleware')

const router = express.Router();

router.get('/admin/products', (req, res) => {
    
})

router.post('/admin/products', (req, res) => {
    
})

router.get('/admin/products/new', (req, res) => {
    res.send( newProductTemplate({}) )
})

router.post('/admin/products/new',
    upload.single('image'),
    [titleValidation, priceValidation],
    handleValidationError( newProductTemplate ),
    async (req, res) => {

        const {title, price} = req.body;

        let image;
        if(req.file){
            image = req.file.buffer.toString('base64');
        }else{
            image = '';
        }

        await prodRepo.create({title, price, image})

        res.send("Product created!")
    })

module.exports = router;