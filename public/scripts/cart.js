// Temporary variables for debugging

const id1 = 'Cheese Burguer';
const id2 = 'Cheese Burguer Bacon';
const id3 = 'Chicken Sandwich';
const id4 = 'Cheese Burger Combo';
const id5 = 'Cheese Burger Bacon Combo';
const id6 = 'Chicken Sandwich Combo';
const id7 = 'Fries';
const id8 = 'Coke';
const id9 = 'Orange Juice';
const id10 = 'Sprite';
const id11 = 'Canada Dry';


// Calculate subtotal, tax, and total
const calcSubTotal = (priceArr) => {
  // Sums the subtotal of all items in the array
  return priceArr.reduce((accumulator, currentValue) => accumulator + currentValue);
};
const calcGrandTotal = (subTotal) => {
  const taxRate = 1.13;
  return taxRate * subTotal;
};
const calcTaxPaid = (subTot, grandTot) => {
  return grandTot - subTot;
};


// Build SELECT statements to populate the cart
// This function will be called once for each product added
const getCartItemFromDb = (productId) => {
  const queryParams = [];
  queryParams.push(productId);
  let queryString = `
  SELECT id, name, price_cents * 100 AS price
  FROM products
  WHERE id = $1;
  `;
  return pool.query(queryString, queryParams)
    .then(res => {
      if (res.rows) {
        return res.rows[0];
      } else {
        return null;
      }
    })
};

// Classes may need to be added to index
// Array to calculate subtotal tax, grant total
// The array will hold the price for each item
let itemsInCart = []
const addItemToCartRow = (productName, productPrice, productId) => {
  //itemsInCart.push(productId);
  const $cartRow = $(`<tr>
  <th scope="row">1</th>
  <td>${productName}</td>
  <td>${productPrice}</td>
  </tr>`);
  $('.cart-table').append($cartRow);
  return $cartRow;
};

// Create event handler for each product card
// Event handler for first burger on page
$(document).ready(function () {
  console.log("The document is ready");
  $('.add-burg-event').on('click', function(e) {
    e.preventDefault();
    const h3 = $(this).closest('.card').find('.card-title');
    const p = $(this).closest('.card').find('.card-footer');
    let productTitle = h3.text().trim();
    let productPrice = p.text().trim();
    console.log(productTitle);
    console.log(productPrice);
    addItemToCartRow(productTitle, productPrice);
  });
});

// The items from the array are dynamically added/displayed in the sidebar
