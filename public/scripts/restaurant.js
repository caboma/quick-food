// File stops working when these are required
// require('dotenv').config();
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// Trigger SMS message sent to customer from restaurants page
$(document).ready(function() {
  console.log('The restaurants document is ready.');
  $('#btn-order-confirm').on('click', function(e) {
    e.preventDefault();

    // Obtain customer name
    let customerName = $(this).closest('.order-row').find('.order-customer-name');
    customerName = customerName.text().trim();
    console.log(customerName); // Remove after debugging

    // Obtain customer order number
    let customerOrderNo = $(this).closest('.order-row').find('.customer-order-number');
    customerOrderNo = customerOrderNo.text().trim();
    console.log(customerOrderNo); // Remove after debugging

    // Obtain customer phone number
    let customerPhone = $(this).closest('.order-row').find('.order-customer-phone').val();
    console.log(customerPhone); // Remove after debugging

    // Create customer message
    let customerMsg = `Hey ${customerName}! Order #${customerOrderNo} has been confirmed. You'll receive another SMS notification when it's ready for pick up.`;
    console.log(customerMsg);


    // Send SMS message to customer

  })
});
