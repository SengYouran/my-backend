const db = require("../db");

const userAccount = {
  // ✅ INSERT user account
  insert: async (conn,data) => {
    const roles = data.roles || "employee";
    const is_active = data.is_active === undefined ? 1 : data.is_active;

    // Validation
    if (!data.employee_id || !data.email || !data.password) {
      throw new Error("Missing required user fields");
    }

    const sql = `
      INSERT INTO useraccount (employee_id, email, password, roles, is_active)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      data.employee_id,
      data.email,
      data.password,
      roles,
      is_active,
    ];

    const [result] = await conn.query(sql, values);

    return {
      id: result.insertId,
      employee_id: data.employee_id,
      email: data.email,
      roles,
      is_active,
    };
  },

  // ✅ UPDATE by employee_id (for transaction)
  updateByEmployeeId: async (conn, employee_id, data) => {
    const sql = `
      UPDATE useraccount
      SET email = ?, roles = ?
      WHERE employee_id = ?
    `;

    const [result] = await conn.query(sql, [
      data.email,
      data.roles,
      employee_id,
    ]);

    return result.affectedRows > 0;
  },
};

module.exports = userAccount;
