const express = require('express')
const { validationResult } = require('express-validator');

const newProductTemplate = require('../../views/admin/products/new');
const {titleValidation, priceValidation} = require('../../routes/admin/validation')
const prodRepo = require('../../repositories/products')

const router = express.Router();

router.get('/admin/products', (req, res) => {
    
})

router.post('/admin/products', (req, res) => {
    
})

router.get('/admin/products/new', (req, res) => {
    res.send( newProductTemplate({}) )
})

router.post('/admin/products/new', [
    titleValidation,
    priceValidation
    ],
    (req, res) => {
    const errors = validationResult(req);
    console.log(errors)

    res.send("Product created!")
})

module.exports = router;