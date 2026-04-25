const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: Number(process.env.MYSQLPORT || 3306),
});

const db = pool.promise();

// ✅ safe test connection
async function testDB() {
  try {
    const conn = await db.getConnection();

    console.log("✅ DB CONNECTED");

    conn.release();
  } catch (err) {
    console.log("❌ DB ERROR:", err.code || err);
    console.error("❌ DB ERROR FULL:", err);
  }
}

testDB();

module.exports = db;
