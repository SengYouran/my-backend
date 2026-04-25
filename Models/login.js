const db = require("../db");

const Login_ERP = {
  getUserByEmail: async (email) => {

    const sql = "SELECT * FROM useraccount WHERE email = ?";
    const [rows] = await db.query(sql, [email]);
    return rows[0];
  },
};

module.exports = Login_ERP;
