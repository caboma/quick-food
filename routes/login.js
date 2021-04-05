const express = require('express');
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
