// Calculate subtotal, tax, and total
const calcSubTotal = (priceArr) => {
  console.log("3", priceArr);
  // Sums the subtotal of all items in the array
  return priceArr.reduce((accumulator, currentValue) => accumulator + currentValue);
};
const calcGrandTotal = (subTotal) => {
  const taxRate = 1.13;
  const total = taxRate * subTotal;
  return Number(total.toFixed(2));
};
const calcTaxPaid = (subTot, grandTot) => {
  const taxes = grandTot - subTot;
  return Number(taxes.toFixed(2));
};

// Classes may need to be added to index
// Array to calculate subtotal tax, grant total
// The array will hold the price for each item
let itemsInCart = [];
let idsInCart = []; // Need this array in index.js
let priceArray = [];
const addItemToCartRow = (productName, productPrice, productId) => {
  itemsInCart.push(productName);
  priceArray.push(productPrice);
  const $cartRow = $(`
  <tr>
  <th scope="row">${itemsInCart.length}</th>
  <td>${productName}</td>
  <td>$ ${productPrice}</td>
</tr>`);
  $('.table-items').append($cartRow);
  return $cartRow;
};

// Create event handler for each product card
// Event handler for first burger on page.
$(document).ready(function() {
  $('.get-ids').css('display', 'none');

  $('.add-burg-event').on('click', function(e) {
    e.preventDefault();
    const h3 = $(this).closest('.card').find('.card-title');
    const p = $(this).closest('.card').find('.card-footer h5');
    const p2 = $(this).closest('.card').find('.get-ids');
    let productTitle = h3.text().trim();
    let productPrice = p.text().trim();
    productPrice = Number(productPrice);
    let productId = p2.text().trim();
    addItemToCartRow(productTitle, productPrice);

    let prodId = $(this).closest('.card').find('.get-ids');
    prodId = prodId.text().trim();
    idsInCart.push(prodId);
    localStorage.setItem('ids', idsInCart);

    // Adjusting subtotal
    let newSubTotal = calcSubTotal(priceArray).toFixed(2);
    $('.subtotal-line').replaceWith(`<td class="subtotal-line">$ ${newSubTotal}</td>`);

    let newGrandTotal = calcGrandTotal(newSubTotal);
    $('.grandtotal-line').replaceWith(`<td class="grandtotal-line">$ ${newGrandTotal}</td>`);

    let newTaxPaid = calcTaxPaid(newSubTotal, newGrandTotal);
    console.log(newTaxPaid);
    $('.taxtotal-line').replaceWith(`<td class="taxtotal-line">$ ${newTaxPaid}</td>`);
  });


  $('#place-order-btn').on('submit', function(e) {
    e.preventDefault();
    $.post({
      url: '/',
      data: {ids: localStorage.getItem('ids')},
      success: function() {
        alert('form was submitted');
      }
    });
  });
});

// The items from the array are dynamically added/displayed in the sidebar

