const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const dbParams = require('../lib/db');

require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports = (db) => {

  const sendSms = (phone, message) => {
    client.messages
      .create({
        body: message,
        from: '+13658000804',
        to: phone
      })
      .then(message => console.log(message.sid, message.status,))
      .catch(err => console.error(err));
  };

  //Update the order status - confirm the order or order is ready
  router.post("/", (req, res) => {
    console.log("restaurant / is executing");
    console.log("req.body", req.body);
    const order_id = req.body.orderID;
    const order_status = req.body.status;
    console.log("ORDER_STATUS", order_status);
    if (order_status === 'Confirmed') {
      confirmMsg = `Hey ${req.body.userName}! Order #${req.body.orderID} has been confirmed. You can pick up your order in ${req.body.duration} minutes.`;
    } else {
      confirmMsg = `Hey ${req.body.userName}! Order #${req.body.orderID} is ready for pickup!`;
    };
    let queryString = `UPDATE orders SET status = '${order_status}' WHERE id = ${order_id}`;
    return db.query(queryString)
      .then(data => {
        console.log("DATA.ROWS", data.rows);
        // TWILIO TESTING
        sendSms(req.body.phone, confirmMsg);
        res.redirect('/restaurant');
      }).catch(err => console.log(err))
      .catch(err => {
        res
          .status(500)
          .json({error: err.message});
      });
  });
  //Retrieve all current orders and load restaurant dashboard. Only admin user can see this page
  router.get("/", (req, res) => {
    const userID = req.session['user_id'];
    const email = req.session['email'];

    let queryString = ` SELECT orders.*, products.name, users.name AS customer, users.phone AS phone FROM orders JOIN users ON orders.user_id = users.id JOIN order_details ON order_details.order_id = orders.id
    JOIN products ON products.id = order_details.product_id
    WHERE orders.user_id = ${userID} ORDER BY orders.id DESC`;
    db.query(queryString)
    .then (data => {
      const orders = {};
      const nameList = [];
      const userList = [];
      for (let row of data.rows) {
        if (!orders[row.id]) {
          orders[row.id] = {status: '', productNames: [], userNames: '', phone: ''};
        }
        orders[row.id].productNames.push(row.name);
        orders[row.id].status = row.status;
        orders[row.id].userNames = row.customer;
        orders[row.id].phone = row.phone;


      }
      const templateVars = {user: userID, orders: orders}
      console.log(templateVars);
      res.render("restaurants", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({error: err.message});
    });
  });
  return router;
};

