/** mysql */
const mysql = require("mysql");
const { MYSQL } = require("@/assets/global.ts");

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
const queryUser = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    // 连接状态查询 查询后关闭 数据库连接模型设计

    connection.query(
      "SELECT * FROM users where username=? and password=?",
      [username, password],
      function (err, result) {
        if (err) {
          // Handle any errors
          console.error("Error query data from MySQL: " + err.message);
          resolve({
            code: "500", // 查询异常
            data: err.message,
          });
        }
        // Log a success message
        console.log("query data from MySQL: " + result);

        if (Array.isArray(result) && result.length > 0) {
          resolve({
            code: "200", // 查询成功
            data: result[0], // 正常一定是唯一的
          });
        } else {
          resolve({
            code: "201", // 状态码201未查询到此人
            data: "",
          });
        }

        // connection.release(); // 释放连接对象 connection.release is not a function  wori
      }
    );
  });
};

module.exports = {
  initMySQL,
  queryUser,
};
