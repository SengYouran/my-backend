const db = require("../db");
const DashboardTeacher = {
  getDataDashboardTeacher: async (employee_id) => {
    const sqlSummary = `
    SELECT 
    COUNT(*) AS total_students,

    SUM(CASE WHEN s.gender='Male' THEN 1 ELSE 0 END) AS total_male,
    SUM(CASE WHEN s.gender='Female' THEN 1 ELSE 0 END) AS total_female,
    SUM(CASE WHEN MONTH(s.createdAt)=MONTH(CURDATE()) 
             AND YEAR(s.createdAt)=YEAR(CURDATE()) 
             THEN 1 ELSE 0 END) AS new_students_this_month,
    SUM(CASE WHEN MONTH(s.createdAt)=MONTH(CURDATE()-INTERVAL 1 MONTH) 
              AND YEAR(s.createdAt)=YEAR(CURDATE()-INTERVAL 1 MONTH) 
              THEN 1 ELSE 0 END) AS students_last_month,
    ROUND((SUM(CASE WHEN MONTH(s.createdAt)=MONTH(CURDATE()) 
                    AND YEAR(s.createdAt)=YEAR(CURDATE()) 
                    THEN 1 ELSE 0 END)
                    -
                    SUM(CASE WHEN MONTH(s.createdAt)=MONTH(CURDATE()-INTERVAL 1 MONTH) 
                    AND YEAR(s.createdAt)=YEAR(CURDATE()-INTERVAL 1 MONTH) 
                    THEN 1 ELSE 0 END))
                    / 
                    NULLIF(SUM(CASE WHEN MONTH(s.createdAt)=MONTH(CURDATE()-INTERVAL 1 MONTH) 
                    AND YEAR(s.createdAt)=YEAR(CURDATE()-INTERVAL 1 MONTH) 
                    THEN 1 ELSE 0 END),0)*100,2) AS percent_growth
    FROM student_tbl s
    INNER JOIN (
    SELECT student_id, MAX(period_end) AS period_end
    FROM payment_tbl
    GROUP BY student_id
    ) p ON s.student_id = p.student_id
    WHERE p.period_end >= CURDATE() AND s.employee_id = ?
    AND s.is_active = 1;
   `;
    const sqlActiveDeactive = `
    SELECT 
    DATE_FORMAT(createdAt, '%Y-%m') AS month,
    SUM(is_active = 1) AS total_active,
    SUM(is_active = 0) AS total_deactive
    FROM student_tbl
    WHERE YEAR(createdAt) = 2026 AND employee_id = ?
    GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
    ORDER BY month;
    `;
    const att_student = `
    SELECT 
    DATE_FORMAT(attendance_date, "%Y-%m") AS month,
    SUM(attendance_status = "Absent") AS total_Adsent_student
    FROM student_attendance_tbl att
    LEFT JOIN student_tbl s ON att.student_id = s.student_id
    WHERE s.employee_id = ?
    GROUP BY DATE_FORMAT(attendance_date,"%Y-%m")
    ORDER BY month
    `;
    const [totalActiveDeactive] = await db.query(sqlActiveDeactive, [
      employee_id,
    ]);
    const summaryTotalActiveDeactive = totalActiveDeactive;
    const [summaryTotalStudent] = await db.query(sqlSummary, [employee_id]);
    const summary = summaryTotalStudent[0];
    const [summaryAtt_student] = await db.query(att_student, [employee_id]);
    return {
      summary,
      summaryTotalActiveDeactive,
      summaryAtt_student,
    };
  },
};
module.exports = DashboardTeacher;
