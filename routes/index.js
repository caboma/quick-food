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

  //Retrieve all products in the database and load menu/product page
  router.get("/", (req, res) => {
    const userID = req.session['userId'];
    let queryString = `SELECT * FROM products`;

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

  //Retrieve all current orders and load restaurant dashboard. Only admin user can see this page
  router.get("/restaurant", (req, res) => {
    const userID = req.session['userId'];
    const email = req.session['email'];
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

  //Check user details if already registered in database
  router.post("/login", (req, res) => {
    const email = req.body.email;

    let queryString = `SELECT * FROM users WHERE email = '${email}'`;

    db.query(queryString)
      .then(data => {
        const userData = data.rows;
        for (let user in userData){
          const userPermission = userData[user].permission;
          const userID = userData[user].id;

          //Load restaurant dashboard is user permission is admin
          if(userPermission === 'admin'){
            req.session['userId'] = userID;
            res.redirect('/restaurant');
          }

          //Load product page is user permission is user
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

  //Update the order status - confirm the order or order is ready
  //order status is posted upon button click and pass value in hidden text
  router.post("/restaurant", (req, res) => {
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

  router.post("/register", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const contact = req.body.contactNo;

    let queryString = `INSERT INTO users (name, email, phone, password, permission)
                       VALUES ('${name}', '${email}', ${contact}, '${password}', 'user')`;
    db.query(queryString)
      .then(data => {
        res.redirect('/');
      })
      .catch(err => {
        res
          .status(500)
          .json({error: err.message});
      });
  })

  router.post("/logout", (req, res) => {
    req.session['userId'] = null;
    res.redirect('/');
  })
  return router;
};
