const db = require("../db");

const Employee_Salary = {
  // ✅ INSERT salary record
  insert: async (conn, data) => {
    if (!data?.employee_id) {
      throw new Error("Missing employee_id");
    }

    const sql = `
      INSERT INTO salary_tbl (employee_id, hire_date,salary, experience, is_active)
      VALUES (?, ?, ?,?, 1)
    `;

    const [result] = await conn.query(sql, [
      data.employee_id,
      data.hire_date,
      data.salary ?? 0,
      data.experience ?? null,
    ]);

    return {
      id: result.insertId,
      employee_id: data.employee_id,
      hire_date: data.hire_date ?? null,
      salary: data.salary ?? 0,
      experience: data.experience ?? null,
      is_active: 1,
    };
  },

  // ✅ UPDATE salary by employee_id
  updateByEmployeeId: async (conn, employee_id, data) => {
    const sql = `
      UPDATE salary_tbl
      SET salary = ?, experience = ?, hire_date = ?
      WHERE employee_id = ?
    `;

    const [result] = await conn.query(sql, [
      data.salary ?? 0,
      data.experience ?? null,
      data.hire_date ?? null,
      employee_id,
    ]);

    return result.affectedRows > 0;
  },
};

module.exports = Employee_Salary;
