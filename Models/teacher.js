const db = require("../db");

const Teacher = {
  getAllTeachers: async () => {
    const sql = `
      SELECT 
        emp.id AS employee_id,
        emp.emp_id,
        emp.first_name,
        emp.last_name,
        emp.profile,
        u.roles,
        t.id,
        t.subject,
        t.qualification
      FROM employee_tbl emp
      LEFT JOIN useraccount u ON u.employee_id = emp.id
      LEFT JOIN teacher_tbl t ON t.employee_id = emp.id
      WHERE u.roles = 'Teacher'
      ORDER BY emp.last_name, emp.first_name
    `;
    const [rows] = await db.query(sql);
    return rows || []; // extra safety
  },

  insert: async (conn, data) => {
    const sql = `
      INSERT INTO teacher_tbl (employee_id, subject, qualification)
      VALUES (?, ?, ?)
    `;
    const [result] = await conn.query(sql, [
      data.employee_id,
      data.subject,
      data.qualification,
    ]);
    return result.insertId;
  },
};

module.exports = Teacher;
