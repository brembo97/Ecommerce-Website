const express = require('express')

const prodRep = require('../../repositories/products')
const productsTemplate = require('../../views/products/index')

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await prodRep.getAll();

    res.send( productsTemplate({ products }))
})

module.exports = router;