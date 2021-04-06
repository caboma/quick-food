const {Pool} = require('pg');
const dbParams = require('../../lib/db');
const db = new Pool(dbParams);
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";


const getPhoneById = function (id) {
  let queryString = `
SELECT phone FROM users WHERE id = ${id};
`;
  return db.query(queryString)
    .then(res => {
      const phone = (res.rows[0].phone)
      return phone;
    })
    .catch(e => console.log(e))

}



module.exports = getPhoneById
