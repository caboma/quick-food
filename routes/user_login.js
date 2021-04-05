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
