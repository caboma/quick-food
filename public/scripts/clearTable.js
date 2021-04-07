$(document).ready(function () {
  $('#place-order').on('click', () => {
    $('.table-items').remove();
    $('.subtotal-line').replaceWith('$ 0.00');
    $('.grandtotal-line').replaceWith('$ 0.00');
    $('.taxtotal-line').replaceWith('$ 0.00');
  })
});
