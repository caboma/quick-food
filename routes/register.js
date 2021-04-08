const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const dbParams = require('../lib/db');

module.exports = (db) => {
  router.post("/", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const contact = req.body.contactNo;
    let queryString = `INSERT INTO users (name, email, phone, password, permission)
                       VALUES ('${name}', '${email}', ${contact}, '${password}', 'user')RETURNING *;`;
    db.query(queryString)
      .then(data => {
        req.session['user_id'] = data.rows[0].id;
        res.redirect('/');
      })
      .catch(err => {
        res
          .status(500)
          .json({error: err.message});
      });
  });
  return router;
};

