const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const dbParams = require('../lib/db');

//ORDERS and return the orders
module.exports = (db) => {
  router.get("/", (req, res) => {
    const userID = req.session.user_id;
    let queryString = ` SELECT orders.*, products.name FROM orders JOIN order_details ON order_details.order_id = orders.id
    JOIN products ON products.id = order_details.product_id
    WHERE orders.user_id = ${userID} ORDER BY orders.id DESC`;
    db.query(queryString)
    .then (data => {
      const orders = {};
      const nameList = [];
      for (let row of data.rows) {
        if (!orders[row.id]) {
          orders[row.id] = {status: '', productNames: []};
        }
        orders[row.id].productNames.push(row.name);
        console.log(row.name);
        orders[row.id].status = row.status;
      }
      const templateVars = {user: userID, orders: orders}
      console.log(templateVars);
      res.render("my-orders", templateVars);
    })
  });
  return router;
};

