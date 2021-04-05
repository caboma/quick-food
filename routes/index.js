/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let queryString = `SELECT * FROM products`;
    db.query(queryString)
      .then(data => {
        productLists = data.rows;
        const templateVars = {product: productLists};
        res.render("index", templateVars);

      })
      .catch(err => {
        res
          .status(500)
          .json({error: err.message});
      });
  });

  router.get("/restaurant", (req, res) => {
    let queryString = `
      SELECT orders.id AS order_number, users.name AS customer, orders.total_amount AS total, orders.status AS status
      FROM orders JOIN users ON orders.user_id = users.id ORDER BY orders.id`;
    db.query(queryString)
      .then(data => {
        orderLists = data.rows;
        const templateVars = {orders: orderLists};
        res.render("restaurants", templateVars);

      })
      .catch(err => {
        res
          .status(500)
          .json({error: err.message});
      });
  })

  // router.get("/restaurant/:order_id", (req, res) => {
  //   let queryString = `
  //   SELECT order_details.order_id, products.name, products.price_cents FROM order_details JOIN products ON order_details.product_id = products.id WHERE order_details.order_id = '1'`;
  //   db.query(queryString)
  //     .then(data => {
  //       orderLists = data.rows;
  //       const templateVars = {orders: orderLists};
  //       res.render("restaurants", templateVars);
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({error: err.message});
  //     });
  // })


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
