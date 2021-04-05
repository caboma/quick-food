const express = require('express');
const users = require('./users');
const router = express.Router();
const cookieSession = require('cookie-session');
const dbParams = require('../lib/db');

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    req.session.user_id = req.params.id;
    res.redirect('/');
  })
  return router;
};

// From before
/* const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/login", (req, res) => {
    console.log("***********************")
    let queryString = `SELECT * FROM users`;
    db.query(queryString)
      .then(data => {
        users = data.rows;
        const templateVars = {product: productLists};
        res.send("LOGIN");
      })
      .catch(err => {
        res
          .status(500)
          .json({error: err.message});
      });
  });
  return router;
};
 */
