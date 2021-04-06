/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

// index.js
const express = require('express');
const router = express.Router();
//TWILIO API
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
// Initial test message
const message = 'Your order will be ready for pick up in 5 minutes!';
const phone = '+16137905701';
// const {idsInCart} = require('../public/scripts/cart');
// const idsInCart = require('../public/scripts/cart');

const getPhoneById = require('../public/helper_functions/getUserPhone')







module.exports = (db) => {

  const sendSms = (phone, message) => {

    client.messages
      .create({
        body: message,
        from: '+13658000804',
        to: phone
      })
      .then(message => console.log(message.sid, message.status))
      .catch(err => console.error(err));
  };

  //Retrieve all products in the database and load menu/product page
  router.get("/", (req, res) => {
    const userID = req.session['user_id'];
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
  /*
        Column      |  Type   |                      Modifiers
  ------------------+---------+-----------------------------------------------------
   id               | integer | not null default nextval('orders_id_seq'::regclass)
   user_id          | integer |
   restaurant_id    | integer |
   ready_for_pickup | boolean | default false
   fulfilled        | boolean | default false
  */
  //const products = [1,2,3,4,5,6];
  const products2 = [1, 2, 3, 4, 5, 6];
  const testId = 1;

  router.post("/", (req, res) => {
    console.log("45", req.body.ids); // has ids
    products = req.body.ids;

    products = products.split(',');
    console.log("52A", products);


    const userId = req.session.user_id
    const addItemToOrder = function (productsArray, order_id) {
      console.log("46", req.data);
      queryString = `
      INSERT INTO order_details(order_id, product_id)
      VALUES

      `
      for (const product of productsArray) {
        queryString += `(${order_id}, ${product}),`
      }
      queryString = queryString.substring(0, queryString.length - 1)
      queryString += `RETURNING *;`;
      console.log("*******************", queryString)
      return db.query(queryString)
        .then(res => {
          console.log(res)
          return res.rows
        });
    }

    const maxIdFunc = function () {
      console.log('67', products);
      let maxIds = db.query(`
      INSERT INTO orders(id, user_id, restaurant_id)
      VALUES ((SELECT (MAX(id) + 1) FROM orders), ${userId}, 1)
      RETURNING *;
      `).then(res => {
        return addItemToOrder(products, res.rows[0].id)
      }).then(res => {
        const message = `New order: ${res[0].order_id}. Login to your account to accept it.`
        getPhoneById(2).then(phone => {
          sendSms(phone, message)
        })
      })
        .catch(err => console.error(err));
      return res.rows;
    }

    maxIdFunc(res.rows)

    // .then(maxIds => console.log("-----------------RES 62", maxIds.rows[0].max)) // 7
    //addItemToOrder(products, req.session.user_id, 3)
    // return router;
    // console.log("*************")
    // console.log("userid", req.session.user_id)

  })

  //Retrieve all current orders and load restaurant dashboard. Only admin user can see this page
  router.get("/restaurant", (req, res) => {
    const userID = req.session['user_id'];
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
        for (let user in userData) {
          const userPermission = userData[user].permission;
          const userID = userData[user].id;

          //Load restaurant dashboard is user permission is admin
<<<<<<< HEAD
          if(userPermission === 'admin'){
=======
          if (userPermission === 'admin') {
>>>>>>> feature-sms-on-order
            req.session['user_id'] = userID;
            res.redirect('/restaurant');
          }

          //Load product page is user permission is user
<<<<<<< HEAD
          if(userPermission === 'user'){
=======
          if (userPermission === 'user') {
>>>>>>> feature-sms-on-order
            req.session['user_id'] = userID;
            res.redirect('/');
          }
        }
        console.log(req.session.user_id);
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
    req.session['user_id'] = null;
    res.redirect('/');
  })
  return router;
};
