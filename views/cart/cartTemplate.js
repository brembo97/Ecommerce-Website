const layout = require('../layout');

module.exports = ({ products }) => {

  const totalPrice = products.reduce((acc, {price, quantity}) => {
    return acc + price * quantity
  },0)

  const renderedProducts = products
    .map(product => {
      return `
        <div class="cart-item message">
          <h3 class="subtitle">${product.title}</h3>
          <div class="cart-right">
            <div>
              $${product.price}  X  ${product.quantity} = 
            </div>
            <div class="price is-size-4">
              $${product.price * product.quantity}
            </div>
            <div class="remove">
              <form method="POST" action="/cart/${product.id}/delete">
                <button class="button is-danger">                  
                  <span class="icon is-small">
                    <i class="fas fa-times"></i>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  return layout({
    content: `
      <div id="cart" class="container">
        <div class="columns">
          <div class="column"></div>
          <div class="column is-four-fifths">
            <h3 class="subtitle"><b>Shopping Cart</b></h3>
            <div>
              ${renderedProducts}
            </div>
            <div class="total message is-info">
              <div class="message-header">
                Total
              </div>
              <h1 class="title">$ ${totalPrice}
              </h1>
              <button class="button is-primary">Buy</button>
            </div>
          </div>
          <div class="column"></div>
        </div>
      </div>
    `
  });
};
