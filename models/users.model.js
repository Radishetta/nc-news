const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows: users }) => {
    return users;
  });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE users.username = $1;`, [username])
    .then(({ rows: user }) => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "User Not Found",
        });
      } else return user[0];
    });
};
