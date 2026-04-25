const db = require("../db");
const TopStudentRank = {
  studentRank: async (employee_id) => {
    const sqlTopRank = `
      SELECT *
      FROM (
      SELECT 
        stu.last_name,
        stu.first_name,
        sp.book_id,
        bk.book_name,
        SUM(sp.attendance_point) AS total_attendance_points,
        SUM(sp.question_point) AS total_question_points,
        SUM(sp.total_point) AS subject_points,
        SUM(sp.attendance_point + sp.question_point + sp.total_point) AS total_points,
        DENSE_RANK() OVER
        (
          PARTITION BY sp.book_id ORDER BY SUM
          (sp.attendance_point + sp.question_point + sp.total_point) DESC
        ) AS ranking,
        sp.remark
        FROM student_tbl stu
        JOIN point_tbl sp 
        ON stu.student_id = sp.student_id
        JOIN book_tbl bk ON sp.book_id = bk.book_id
        WHERE stu.employee_id = ?
        AND DATE_FORMAT(sp.point_date, '%Y-%m') = (
		SELECT MAX(DATE_FORMAT(point_date, '%Y-%m'))
		FROM point_tbl)
        GROUP BY stu.student_id, sp.book_id, stu.last_name, stu.first_name, sp.remark
        ) t
        WHERE ranking <= 5
        ORDER BY t.book_id, t.ranking ASC;
    `;
    const [topRankingStudent] = await db.query(sqlTopRank, [employee_id]);
    return topRankingStudent;
  },
};
module.exports = TopStudentRank;
