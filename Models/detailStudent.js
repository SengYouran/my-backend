const db = require("../db");
const DetailStudent = {
  getDetailStudent: async (student_id) => {
    const sql = `
    SELECT 
    stu.last_name,
    stu.first_name,
    stu.gender,
    stu.telephone,
    stu.dob,
    stu.address,
    bk.book_name,
    SUM(COALESCE(pt.attendance_point,0) + COALESCE(pt.question_point,0) + COALESCE(pt.total_point,0)) AS total_points,
    CASE
        WHEN SUM(pt.attendance_point + pt.question_point + pt.total_point) >= 90 THEN 'A'
        WHEN SUM(pt.attendance_point + pt.question_point + pt.total_point) >= 80 THEN 'B'
        WHEN SUM(pt.attendance_point + pt.question_point + pt.total_point) >= 70 THEN 'C'
        WHEN SUM(pt.attendance_point + pt.question_point + pt.total_point) >= 60 THEN 'D'
        WHEN SUM(pt.attendance_point + pt.question_point + pt.total_point) >= 50 THEN 'E'
        ELSE 'F'
        END AS level
        FROM student_tbl stu
        LEFT JOIN point_tbl pt 
        ON stu.student_id = pt.student_id
        LEFT JOIN book_tbl bk 
        ON stu.book_id = bk.book_id
        WHERE stu.student_id = ? 
        AND MONTH(pt.createdAt) = MONTH(CURRENT_DATE())
        AND YEAR(pt.createdAt) = YEAR(CURRENT_DATE())
        GROUP BY 
        stu.student_id,
        stu.last_name,
        stu.first_name,
        stu.telephone,
        stu.dob,
        stu.address,
        bk.book_name
        ORDER BY stu.student_id DESC;  
        `;
    const [data] = await db.query(sql, [student_id]);
    return data;
  },
};
module.exports = DetailStudent;
