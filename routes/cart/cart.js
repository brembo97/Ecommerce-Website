const express = require('express');
const router = express.Router();
const cartRepo = require('../../repositories/carts');
const prodRepo = require('../../repositories/products');
const cartTemplate = require('../../views/cart/cartTemplate');

router.post('/cart/products', async (req, res) => {
    
    // Create or retrieve cart
    let cart;
    if(!req.session.cartId){
        cart = await cartRepo.create({products: []})
        req.session.cartId = cart.id;
    } else{
        cart = await cartRepo.getOne(req.session.cartId)
    }   

    // Add new product to cart or increase quantity
    const existingProd = cart.products.find(prod => prod.id === req.body.productId)
    if(!existingProd){
        cart.products.push({id: req.body.productId, quantity: 1 })
    }else{
        existingProd.quantity++;
    }
    // Persist the data in the repo
    try{
        await cartRepo.update(cart.id, {products: cart.products})
    }catch{
        return res.send("There was an error retrieving your cart")
    }

    res.redirect("/cart");
})

router.get('/cart', async (req, res) => {
    
    // No cart created
    if(!req.session.cartId){
        return res.redirect('/')
    }

    const cart = await cartRepo.getOne(req.session.cartId);

    // Get the data from the products in the cart
    const products = await Promise.all(cart.products.map( async (product) => {
        const productInfo = await prodRepo.getOne(product.id)

        return {title: productInfo.title,
                price: productInfo.price,
                ...product}
    }))

    res.send( cartTemplate({ products }));
})

router.post('/cart/:productId/delete', async (req ,res) => {

    const cart = await cartRepo.getOne(req.session.cartId);
    
    // Find the product to remove
    const removeIndex = cart.products.findIndex(product => product.id === req.params.productId)
    cart.products.splice(removeIndex, 1);

    // Persist the data in the repo
    try{
        await cartRepo.update(cart.id, {products: cart.products})
    }catch{
        return res.send("There was an error retrieving your cart")
    }

    res.redirect('/cart');
})


module.exports = router