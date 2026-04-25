const db = require("../db");
const paginate = require("../Utility/paginate");
const StudentAttendance = {
  getStudentAttendances: async (employee_id, page, limit) => {
    const dataQuery = `
  SELECT stu.employee_id, stu.last_name, stu.first_name, stu.telephone,
  DATE_FORMAT(att.attendance_date, '%Y-%m-%d') AS attendance_date,
  att.attendance_status, att.description
  FROM student_tbl stu
  LEFT JOIN student_attendance_tbl att 
  ON stu.student_id = att.student_id
  WHERE att.attendance_status = "Absent"
  AND stu.employee_id = ?
  AND MONTH(att.attendance_date) = MONTH(CURDATE())
  AND YEAR(att.attendance_date) = YEAR(CURDATE())
  ORDER BY stu.employee_id DESC
`;

    const countQuery = `
  SELECT COUNT(*) AS total
  FROM student_attendance_tbl att
  LEFT JOIN student_tbl s 
  ON att.student_id = s.student_id
  WHERE att.attendance_status = "Absent"
  AND s.employee_id = ?
  AND MONTH(att.attendance_date) = MONTH(CURDATE())
  AND YEAR(att.attendance_date) = YEAR(CURDATE())
`;
    const totalPaginate = await paginate({
      db,
      page,
      limit,
      dataQuery,
      countQuery,
      params: [employee_id],
    });
    return {
      rows: totalPaginate.results,
      pagination: totalPaginate.pagination,
    };
  },
  insertAttendance: async (conn, data) => {
    const sql = `
      INSERT INTO student_attendance_tbl 
      (student_id, attendance_date, attendance_status, description)
      VALUE (?,?,?,?)    
    `;
    const value = [
      data.student_id,
      data.attendance_date,
      data.attendance_status,
      data.description,
    ];
    const [results] = await conn.query(sql, value);
    return {
      attendance_id: results.insertId,
      ...data,
    };
  },
};
module.exports = StudentAttendance;
