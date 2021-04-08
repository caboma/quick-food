const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const dbParams = require('../lib/db');

module.exports = (db) => {
  router.post("/r", (req, res) => {
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
  })
  router.get("/", (req, res) => {
    const userID = req.session['user_id'];
    const email = req.session['email'];
    let queryString = `
      SELECT orders.id AS order_number, users.name AS customer, orders.status AS status, users.phone AS phone
      FROM orders JOIN users ON orders.user_id = users.id
      WHERE orders.status != 'Ready' OR orders.status=null
      ORDER BY orders.id DESC`;
    db.query(queryString)
      .then(data => {
        orderLists = data.rows;
        const templateVars = {orders: orderLists, user: userID};
        res.render("restaurants", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({error: err.message});
      });
  })
  return router;
};

