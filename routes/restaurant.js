const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const dbParams = require('../lib/db');


module.exports = (db) => {
  //Update the order status - confirm the order or order is ready
  router.post("/", (req, res) => {
    const order_id = req.body.orderID;
    const order_status = req.body.status;
    let queryString = `UPDATE orders SET status = '${order_status}' WHERE id = '${order_id}'`;
    db.query(queryString)
      .then(data => {
        res.redirect('/restaurant');
      })
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

    let queryString = ` SELECT orders.*, products.name, users.name AS customer FROM orders JOIN users ON orders.user_id = users.id JOIN order_details ON order_details.order_id = orders.id
    JOIN products ON products.id = order_details.product_id
    WHERE orders.user_id = ${userID} ORDER BY orders.id DESC`;
    db.query(queryString)
    .then (data => {
      const orders = {};
      const nameList = [];
      const userList = [];
      for (let row of data.rows) {
        if (!orders[row.id]) {
          orders[row.id] = {status: '', productNames: [], userNames: []};
        }
        orders[row.id].productNames.push(row.name);
        orders[row.id].status = row.status;
        orders[row.id].userNames.push(row.customer);

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

