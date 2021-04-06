/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

// index.js
const express = require('express');
const router = express.Router();
// const {idsInCart} = require('../public/scripts/cart');

// const idsInCart = require('../public/scripts/cart');

module.exports = (db) => {
  router.get("/", (req, res) => {
    let queryString = `SELECT * FROM products`;
    //value from login, we will use it to link the order with the logged id.
    // console.log(req.session.user_id)
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
/*
      Column      |  Type   |                      Modifiers
------------------+---------+-----------------------------------------------------
 id               | integer | not null default nextval('orders_id_seq'::regclass)
 user_id          | integer |
 restaurant_id    | integer |
 ready_for_pickup | boolean | default false
 fulfilled        | boolean | default false
*/
const products = [1,2,3,4,5,6];
const testId = 1;
  router.post("/", (req, res) =>{
    console.log("45", req.body);
    console.log("46", req.data);
    const userId = req.session.user_id
    const addItemToOrder = function (productsArray, order_id) {
      queryString = `
      INSERT INTO order_details(order_id, product_id)
      VALUES
      `
      for (const product of productsArray) {
        queryString += `(${order_id}, ${product}),`
      }
      queryString = queryString.substring(0, queryString.length - 1) + `;`

      console.log("*******************", queryString)
      return db.query(queryString)
        .then(res => console.log(res));
    }

    const maxIdFunc = function() {
      console.log('67', products);
      let maxIds = db.query(`
      INSERT INTO orders(id, user_id, restaurant_id)
      VALUES ((SELECT (MAX(id) + 1) FROM orders), ${userId}, 1)
      RETURNING *;
      `).then(res => {
        console.log(res.rows[0].id)
        addItemToOrder(products, res.rows[0].id)
      })
      .catch(err => console.error(err));
      return res.rows;
    }
    console.log("***********", maxIdFunc())
    // .then(maxIds => console.log("-----------------RES 62", maxIds.rows[0].max)) // 7
    //addItemToOrder(products, req.session.user_id, 3)
    // return router;
    // console.log("*************")
    // console.log("userid", req.session.user_id)

  })

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
