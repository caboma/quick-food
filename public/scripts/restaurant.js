// Trigger SMS message sent to customer from restaurants page
$(document).ready(function() {
  console.log('The restaurants document is ready.');
  $('.btn-order-confirm').on('click', function(e) {
    e.preventDefault();

    // Obtain customer name
    let customerName = $(this).closest('.order-row').find('.order-customer-name');
    customerName = customerName.text().trim();
    console.log(customerName); // Remove after debugging

    // Obtain customer order number
    let customerOrderNo = $(this).closest('.order-row').find('.customer-order-number');
    customerOrderNo = customerOrderNo.text().trim();
    console.log(customerOrderNo); // Remove after debugging

    // Obtain time in minutes
    let timeToReady = $(this).closest('.order-row').find('.order-duration');
    timeToReady = timeToReady.text().trim();
    console.log(timeToReady); // Remove after debugging

    // Obtain customer phone number
    let customerPhone = $(this).closest('.order-row').find('.order-customer-phone').val();
    console.log(customerPhone); // Remove after debugging

    // Create customer message
    let customerMsg = `Hey ${customerName}! Order #${customerOrderNo} has been confirmed. You can pick up your order in ${timeToReady} minutes.`;
    console.log(customerMsg);


    // Save above data to localStorage
    let orderData = {
      name: customerName,
      order: customerOrderNo,
      time: timeToReady,
      phone: customerPhone,
      message: customerMsg
    }

    // Leads to index.js route on line 230
    $.ajax({
      url: `/twilio`,
      method: 'POST',
      data: orderData
    }).then(res => console.log('AJAX req sent', res))
    .catch(err => console.error(err));




  })
});
