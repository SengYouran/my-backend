const db = require("../db");

const Login_ERP = {
  getUserByEmail: async (email) => {
    console.log("🔥 SEARCH EMAIL:", email);

    const sql = "SELECT * FROM useraccount WHERE email = ?";
    const [rows] = await db.query(sql, [email]);

    console.log("🔥 DB RESULT:", rows);

    return rows[0];
  },
};

module.exports = Login_ERP;
