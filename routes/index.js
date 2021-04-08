const express = require('express');
const router = express.Router();
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const getPhoneById = require('../public/helper_functions/getUserPhone')

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

  //Retrieve all products in the database and load menu/product page
  router.get("/", (req, res) => {
    const userID = req.session['user_id'];
    let queryString = `SELECT id, name, description, ROUND((price_cents / 100), 2) AS price_cents, image FROM products`;
    db.query(queryString)
      .then(data => {
        productLists = data.rows;
        const templateVars = {product: productLists, user: userID};
        res.render("index", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({error: err.message});
      });
  });

  router.post("/", (req, res) => {
    products = req.body.ids;
    products = products.split(',');
    const userId = req.session.user_id
    const addItemToOrder = function (productsArray, order_id) {
      queryString = `
      INSERT INTO order_details(order_id, product_id)
      VALUES
      `
      for (const product of productsArray) {
        queryString += `(${order_id}, ${product}),`
      }
      queryString = queryString.substring(0, queryString.length - 1)
      queryString += `RETURNING *;`;
      return db.query(queryString)
        .then(res => {
          return res.rows
        });
    }

    const maxIdFunc = function () {
      return db.query(`
    INSERT INTO orders( user_id, restaurant_id, status)
    VALUES (${userId}, 1, 'pending')
    RETURNING *;
    `).then(res => {
        return addItemToOrder(products, res.rows[0].id)
      }).then(res => {
        const message = `New order: ${res[0].order_id}. Login to your account to accept it.`
        getPhoneById(userId).then(phone => {
          sendSms(phone, message)
        })
      })
        .catch(err => console.error(err));
    }
    maxIdFunc()
  })

  // Router for the restaurant.js AJAX call
  router.post('/twilio/confirmed', (req, res) => {
    sendSms(req.body.phone, req.body.message);
  });
  router.post('/twilio/ready', (req, res) => {
    sendSms(req.body.phone, req.body.message);
  });
  return router;
};
