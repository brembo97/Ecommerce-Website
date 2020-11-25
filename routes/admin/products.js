const express = require('express')
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const newProductTemplate = require('../../views/admin/products/new');
const productIndexTemplate  = require('../../views/admin/products/index.js');
const productEditTemplate  = require('../../views/admin/products/edit.js');
const {titleValidation, priceValidation} = require('../../routes/admin/validation')
const prodRepo = require('../../repositories/products');
const { handleValidationError, requireAuthorization } = require('./middleware')

const router = express.Router();

router.get('/admin/products',
    requireAuthorization,
    async (req, res) => {
        const products = await prodRepo.getAll();
        res.send( productIndexTemplate({ products }) )
})

router.get('/admin/products/new',
    requireAuthorization,
    (req, res) => {
        res.send( newProductTemplate({}) )
    })

router.post('/admin/products/new',
    requireAuthorization,
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

        res.redirect('/admin/products');
    })

router.get('/admin/products/:id/edit', requireAuthorization, async (req, res) => {
    const product = await prodRepo.getOne(req.params.id);

    if(!product){
        return res.send('Product not found');
    }

    res.send( productEditTemplate({ product }) );
})

router.post('/admin/products/:id/edit', requireAuthorization, async (req, res) => {
    res.redirect('/admin/products');
})

module.exports = router;