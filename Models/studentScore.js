const db = require("../db");
const StudentScore = {
  getStudentPoint: async (book_id, employee_id) => {
    /*const sql = `
    SELECT 
    stu.last_name,
    stu.first_name,
    SUM(sp.attendance_point) AS total_attendance_points,
    SUM(sp.question_point) AS total_question_points,
    SUM(sp.total_point) AS subject_points,
    SUM(sp.attendance_point + sp.question_point + sp.total_point) AS total_points,
    ROW_NUMBER() OVER (ORDER BY SUM(sp.attendance_point + sp.question_point + sp.total_point) DESC) AS ranking,
    sp.remark
    FROM student_tbl stu
    JOIN point_tbl sp 
    ON stu.student_id = sp.student_id
    WHERE sp.book_id = ? AND stu.employee_id = ?
    GROUP BY stu.student_id, stu.employee_id, stu.last_name, stu.first_name,sp.remark
    ORDER BY total_points DESC;
        `;*/
    const sql = `
    SELECT 
    stu.last_name,
    stu.first_name,
    SUM(sp.attendance_point) AS total_attendance_points,
    SUM(sp.question_point) AS total_question_points,
    SUM(sp.total_point) AS subject_points,
    SUM(sp.attendance_point + sp.question_point + sp.total_point) AS total_points,
    DENSE_RANK() OVER (
    ORDER BY SUM(sp.attendance_point + sp.question_point + sp.total_point) DESC
    ) AS ranking,
    sp.remark
    FROM student_tbl stu
    JOIN point_tbl sp 
    ON stu.student_id = sp.student_id
    WHERE sp.book_id = ? 
    AND stu.employee_id = ?
    AND DATE_FORMAT(sp.point_date, '%Y-%m') = (
		SELECT MAX(DATE_FORMAT(point_date, '%Y-%m'))
		FROM point_tbl)
    GROUP BY stu.student_id, stu.employee_id, stu.last_name, stu.first_name, sp.remark
    ORDER BY total_points DESC;
        `;

    const [rows] = await db.query(sql, [book_id, employee_id]);
    return rows;
  },
  insertScore: async (conn, data) => {
    const sql = `
            INSERT INTO point_tbl
             (student_id, book_id,attendance_point, question_point, total_point, point_date, remark)
             VALUE (?,?,?,?,?,?,?)
        `;
    const value = [
      data.student_id,
      data.book_id,
      data.attendance_point,
      data.question_point,
      data.total_point,
      data.point_date,
      data.remark,
    ];
    const [results] = await conn.query(sql, value);
    return {
      point_id: results.insertScore,
      ...data,
    };
  },
};
module.exports = StudentScore;
