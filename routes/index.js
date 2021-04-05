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
  return router;
};
