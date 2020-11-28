const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const adminAuthRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products')
const productsRouter = require('./routes/products/products')
const cartRouter = require('./routes/cart/cart')

const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieSession({
    name: "session",
    keys: ["azsmqertimzcndqwekdkp"]
}))

app.use(adminAuthRouter)
app.use(adminProductsRouter)
app.use(productsRouter)
app.use(cartRouter)

app.listen(3000, () => {
    console.log("Listening on port 3000")
});