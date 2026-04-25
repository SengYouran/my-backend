const mysql = require("mysql2");

// =======================
// ENV CHECK (IMPORTANT)
// =======================
if (
  !process.env.MYSQLHOST ||
  !process.env.MYSQLUSER ||
  !process.env.MYSQLPASSWORD ||
  !process.env.MYSQLDATABASE
) {
  console.error("❌ ENV MISSING - check Vercel variables");
}

// =======================
// CREATE POOL
// =======================
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: Number(process.env.MYSQLPORT),
  waitForConnections: true,
  connectionLimit: 10,
});

// promise wrapper
const db = pool.promise();

// =======================
// TEST CONNECTION
// =======================
async function testDB() {
  try {
    console.log("HOST:", process.env.MYSQLHOST);
    console.log("USER:", process.env.MYSQLUSER);

    const conn = await db.getConnection();
    console.log("✅ DB CONNECTED");

    conn.release();
  } catch (err) {
    console.log("❌ DB ERROR:", err.message);
  }
}

testDB();

module.exports = db;