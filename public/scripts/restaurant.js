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
    let customerOrderNo = $(this).closest('.order-row').find('.order-customer-number');
    customerOrderNo = customerOrderNo.text().trim();
    console.log(customerOrderNo); // Remove after debugging

    // Obtain time in minutes
    let timeToReady = $(this).closest('.order-row').find('.order-duration');
    timeToReady = timeToReady.val().trim();
    console.log(timeToReady); // Remove after debugging

    // Obtain customer phone number
    let customerPhone = $(this).closest('.order-row').find('.order-customer-phone');
    customerPhone = customerPhone.val().trim();
    console.log(customerPhone); // Remove after debugging

    // Create customer message
    let confirmMsg = `Hey ${customerName}! Order #${customerOrderNo} has been confirmed. You can pick up your order in ${timeToReady} minutes.`;
    console.log(confirmMsg);


    // Save above data to localStorage
    let orderData = {
      name: customerName,
      order: customerOrderNo,
      time: timeToReady,
      phone: customerPhone,
      message: confirmMsg
    }

    // Leads to index.js route on line 230
    // When order is confirmed
    $.ajax({
      url: `/twilio/confirmed`,
      method: 'POST',
      data: orderData
    }).then(res => console.log('AJAX req sent', res))
    .catch(err => console.error(err));
  })

  $('.btn-order-ready').on('click', function(e) {
    e.preventDefault()

    // Obtain customer name
    let customerName = $(this).closest('.order-row').find('.order-customer-name');
    customerName = customerName.text().trim();
    console.log(customerName); // Remove after debugging

    // Obtain customer order number
    let customerOrderNo = $(this).closest('.order-row').find('.order-customer-number');
    customerOrderNo = customerOrderNo.text().trim();
    console.log(customerOrderNo); // Remove after debugging

    // Obtain time in minutes
    let timeToReady = $(this).closest('.order-row').find('.order-duration');
    timeToReady = timeToReady.val().trim();
    console.log(timeToReady); // Remove after debugging

    // Obtain customer phone number
    let customerPhone = $(this).closest('.order-row').find('.order-customer-phone');
    customerPhone = customerPhone.val().trim();
    console.log(customerPhone); // Remove after debugging

    let readyMsg = `Hey ${customerName}! Order #${customerOrderNo} is ready for pickup!`;
    console.log(readyMsg); // Remove after debugging

    let orderData = {
      name: customerName,
      order: customerOrderNo,
      time: timeToReady,
      phone: customerPhone,
      message: readyMsg
    }

    // When order is ready
    $.ajax({
      url: `/twilio/ready`,
      method: 'POST',
      data: orderData
    }).then(res => console.log('AJAX req sent', res))
    .catch(err => console.error(err));
  })



});
