// db.js
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Youran12#",
  database: "project",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ export pool.promise() directly
module.exports = pool.promise();
