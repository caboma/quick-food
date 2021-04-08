const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const dbParams = require('../lib/db');

module.exports = (db) => {
  router.post("/", (req, res) => {
    const email = req.body.email;
    let queryString = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(queryString)
      .then(data => {
        const userData = data.rows;
        for (let user in userData) {
          const userPermission = userData[user].permission;
          const userID = userData[user].id;
          //Load restaurant dashboard is user permission is admin
          if (userPermission === 'admin') {
            req.session['user_id'] = userID;
            res.redirect('/restaurant');
          }
          //Load product page is user permission is user
          if (userPermission === 'user') {
            req.session['user_id'] = userID;
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
  return router;
};


