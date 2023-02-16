const mysql = require("mysql");
const { MYSQL } = require("./global.ts");

// Create a connection object
let connection;

const initMySQL = () => {
  connection = mysql.createConnection({
    host: MYSQL.URL.DEV,
    user: MYSQL.USER,
    password: MYSQL.PASSWORD,
    database: MYSQL.DATABASE,
  });

  // Connect to the MySQL database
  connection.connect(function (err) {
    if (err) {
      // Handle any errors
      console.error("Error connecting to MySQL: " + err.stack);
      return;
    }
    // Log a success message
    console.log("Connected to MySQL as id " + connection.threadId);
  });
};

/**
 * TODO 查询用户数据
 * @param {object} dbName 数据库的名字
 * @return {object} bucket是否存在boolearn
 */
const queryUser = ({ user, password }) => {
  connection.query(
    "SELECT * FROM users wherer user=? and password=?",
    [user, password],
    function (err, result) {
      if (err) {
        // Handle any errors
        console.error("Error inserting data into MySQL: " + err.message);
        return;
      }
      // Log a success message
      console.log("Inserted data into MySQL: " + result.affectedRows);
    }
  );
};

module.exports = {
  initMySQL,
  queryUser
};
