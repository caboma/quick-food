// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// and set the environment variables. See http://twil.io/secure

require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Your order will be ready for pick up in 5 minutes!',
     from: '+13658000804',
     to: '+16137905701'
   })
  .then(message => console.log(message.sid))
  .catch(err => console.error(err));
