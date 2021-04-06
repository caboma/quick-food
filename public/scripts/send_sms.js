// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
//
// and set the environment variables. See http://twil.io/secure
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Initial test message
const message = 'Your order will be ready for pick up in 5 minutes!';
const phone = '+16137905701';

const sendSms = (phone, message) => {
  client.messages
    .create({
      body: message,
      from: '+13658000804',
      to: phone
    })
  // .then(message => console.log(message.sid, message.status))
  // .catch(err => console.error(err));
};



// sendSms(phone, message);

// jQuery button/sms event handler
// $(document).ready(function () {
//   // Send sms to restaurant when client places order
//   $('#client-place-order').on('click', function () {
//     sendSms(phone, message);
//   })
//   // Send sms to client when restaurant confirms order
//   $('#restaurant-confirm-order').on('click', function () {
//     sendSms(phone, message);
//   })
// });


