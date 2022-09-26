const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const registerNewUser = function(user) {
  return pool
    .query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
      `, [user.name, user.email, user.password]
    )
    .then((result) => {
      if (result.rows[0]) {
        return Promise.resolve(result.rows[0]);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.registerNewUser = registerNewUser;

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  console.log(`fn getuserwithemail called`); // tester delete
  return pool
    .query(`
      SELECT *
      FROM users
      WHERE email = $1;
      `, [email]
    )
    .then((result) => {
      console.log(`fn getuserwithemail resolved, got result`, result.rows[0]); // tester delete
      if (result.rows[0]) {
        return Promise.resolve(result.rows[0]);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithEmail = getUserWithEmail;


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
 const getUserWithId = function(id) {
  console.log(`called getUserWithId`);
  return pool
    .query(`
      SELECT *
      FROM users
      WHERE id = $1;
      `, [id]
    )
    .then((result) => {
      if (result.rows[0]) {
        return Promise.resolve(result.rows[0]);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;


 /**
   * Check if a user exists with a given username and password
   * @param {String} email
   * @param {String} password encrypted
   */
const login = function(email, password) {
  console.log(`fn login called`);
  return getUserWithEmail(email)
  .then(user => {
    console.log(`login resolved, user retrieved:`, user);
    if (bcrypt.compareSync(password, user.password)) {
      console.log(`password matches`);
      return Promise.resolve(user);
    }
    console.log(`password doesn't match`);
    return null;
    });
}
exports.login = login;