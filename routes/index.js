/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

// index.js
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userID = req.session['userId'];
    let queryString = `SELECT * FROM products`;
    //value from login, we will use it to link the order with the logged id.
    // console.log(req.session.user_id)
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

  router.get("/restaurant", (req, res) => {
    const userID = req.session['userId'];
    let queryString = `
      SELECT orders.id AS order_number, users.name AS customer, orders.total_amount AS total, orders.status AS status
      FROM orders JOIN users ON orders.user_id = users.id ORDER BY orders.id`;
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

  router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let queryString = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(queryString)
      .then(data => {
        const userData = data.rows;
        for (let user in userData){
          let userPermission = userData[user].permission
          const userID = userData[user].id
          if(userPermission === 'admin'){
            req.session['userId'] = userID;
            res.redirect('/restaurant');
          }
          if(userPermission === 'user'){
            req.session['userId'] = userID;
            res.redirect('/');
          }
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({error: err.message});
      });
  })

  router.post("/restaurant", (req, res) => {
    const order_id = req.body.orderID;
    const order_status = req.body.status;
    console.log(req.body)

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
  return router;
};
