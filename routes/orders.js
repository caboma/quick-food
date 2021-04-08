const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const dbParams = require('../lib/db');

//ORDERS and return the orders
module.exports = (db) => {
  router.get("/", (req, res) => {
    const userID = req.session.user_id;
    let queryString = `
    SELECT * FROM orders WHERE user_id = ${userID} ORDER BY id DESC`;
    db.query(queryString)
      .then(data => {
        ordersByUser = data.rows;
        const nameList = {};
        for (let orderNo of ordersByUser) {
          let queryProductName = `
            SELECT products.name FROM order_details
            JOIN products ON products.id = order_details.product_id WHERE order_id = ${orderNo.id}
          `;
          db.query(queryProductName)
            .then(data => {
              itemLists = data.rows;
              nameList[orderNo.id] = itemLists
              if (orderNo.id === ordersByUser[ordersByUser.length - 1].id) {
                templateVars = {orders: ordersByUser, user: userID, productNames: nameList};
                res.render("my-orders", templateVars);
              }
            })
        }
      })
      .catch(err => {
        res.status(500)
          .json({error: err.message});
      });
  })
  return router;
};

