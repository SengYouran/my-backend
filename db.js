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
  console.error("ENV MISSING - check .env variables");
}

// =======================
// CREATE POOL (FOR TIDB CLOUD)
// =======================
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: Number(process.env.MYSQLPORT) || 4000,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
});

// promise wrapper
const db = pool.promise();

// =======================
// TEST CONNECTION
// =======================
async function testDB() {
  try {
    console.log("Connecting to TiDB Cloud...");
    console.log("HOST:", process.env.MYSQLHOST);
    console.log("USER:", process.env.MYSQLUSER);

    const conn = await db.getConnection();
    console.log("✅ DB CONNECTED TO TIDB CLOUD SUCCESSFULLY!");

    conn.release();
  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
  }
}

testDB();

module.exports = db;
