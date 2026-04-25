const db = require("../db");
const TeacherBookModel = {
  getTeacherBook: async () => {
    const sql = `
     SELECT emp.id, emp.last_name, emp.first_name, bk.book_id, bk.book_name, t.subject
     from teacher_tbl t
     LEFT JOIN employee_tbl emp ON t.employee_id = emp.id
     LEFT JOIN teacher_book_tbl tbk ON t.id = tbk.teacher_id
     LEFT JOIN book_tbl bk ON tbk.book_id = bk.book_id
    `;
    const [rows] = await db.query(sql);
    return rows;
  },
  insertTeacherBook: async (conn, data) => {
    const { teacher_id, book_id } = data;
    const sql = `
      INSERT INTO teacher_book_tbl (teacher_id, book_id)
      VALUES (?, ?)
  `;

    const [result] = await conn.query(sql, [teacher_id, book_id]);

    return result.insertId;
  },
};
module.exports = TeacherBookModel;
