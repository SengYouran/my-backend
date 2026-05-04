const db = require("../db");
const paginate = require("../Utility/paginate");
const paginates = require("../Utility/paginate");
const Student = {
  getAllStudent: async (teacher_ID, page = 1, limit = 10) => {
    const dataQuery = `
    SELECT 
    emp.id, 
    b.book_name,
    s.employee_id,
    s.student_id,
    s.first_name,
    s.last_name,
    s.telephone,
    s.gender,
    c.class_name,
    s.is_active,
    s.createdAt,
    MAX(sh.shift) AS shift,
    TIME_FORMAT(MAX(sh.start_time), '%H:%i') AS start_time,
    TIME_FORMAT(MAX(sh.end_time), '%H:%i') AS end_time,
    MAX(p.period_end) AS period_end
    FROM student_tbl s
    LEFT JOIN employee_tbl emp ON s.employee_id = emp.id
    LEFT JOIN book_tbl b ON s.book_id = b.book_id
    LEFT JOIN class_tbl c ON s.class_id = c.class_id
    LEFT JOIN shift_tbl sh ON s.student_id = sh.student_id
    INNER JOIN (
    SELECT student_id, MAX(period_end) AS period_end
    FROM payment_tbl
    GROUP BY student_id
    ) p ON s.student_id = p.student_id
    AND p.period_end >= CURDATE()
    WHERE s.employee_id = ? 
    AND s.is_active = 1
    GROUP BY 
    emp.id,
    b.book_name,
    s.employee_id,
    s.student_id,
    s.first_name,
    s.last_name,
    s.telephone,
    s.gender,
    c.class_name,
    s.is_active,
    s.createdAt
    ORDER BY s.student_id DESC
    `;
    const countQuery = `
      SELECT 
        COUNT(*) AS total_students,
        SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) AS total_male,
        SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) AS total_female,
        SUM(
          CASE 
            WHEN MONTH(createdAt) = MONTH(CURRENT_DATE()) 
            AND YEAR(createdAt) = YEAR(CURRENT_DATE()) 
            THEN 1 ELSE 0 
          END
        ) AS new_students_this_month
        FROM student_tbl s
         INNER JOIN (
    SELECT student_id, MAX(period_end) AS period_end
    FROM payment_tbl
    GROUP BY student_id
    ) p ON s.student_id = p.student_id 
     AND p.period_end >= CURDATE()
      WHERE is_active = 1 AND employee_id = ?
    `;
    const [totalStudentTeacher] = await db.query(countQuery, [teacher_ID]);
    const paginate = await paginates({
      db,
      teacher_ID,
      page,
      dataQuery,
      countQuery,
      limit,
      params: [teacher_ID],
    });
    return {
      data: paginate.results,
      pagination: paginate.pagination,
      totalStudentUnderTeacher: totalStudentTeacher[0],
    };
  },
  getOneStudent: async (student_id) => {
    const sqlOneStudent = `
      SELECT 
  s.*, 
  sh.shift,
  sh.start_time,
  sh.end_time 
FROM student_tbl s
LEFT JOIN shift_tbl sh 
  ON s.student_id = sh.student_id
WHERE s.student_id = ?;
    `;
    const [results] = await db.query(sqlOneStudent, [student_id]);
    const oneStudent = results[0];
    return oneStudent;
  },
  getStudentUderTeacher: async (employee_id, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT 
    b.book_name,
    s.employee_id,
    s.student_id,
    id_card,
    s.first_name,
    s.last_name,
    s.telephone,
    s.gender,s.is_active,s.createdAt,
    c.class_name,
    sh.shift, 
    TIME_FORMAT(sh.start_time, '%H:%i') AS start_time,
    TIME_FORMAT(sh.end_time, '%H:%i') AS end_time
    FROM student_tbl s
    LEFT JOIN book_tbl b 
    ON s.book_id = b.book_id
    LEFT JOIN class_tbl c 
    ON s.class_id = c.class_id
    LEFT JOIN shift_tbl sh 
    ON s.student_id = sh.student_id
    LEFT JOIN employee_tbl emp ON s.employee_id = emp.id
    INNER JOIN (SELECT student_id, MAX(period_end) AS period_end
    FROM payment_tbl
    GROUP BY student_id) p ON s.student_id = p.student_id 
    AND p.period_end >= CURDATE()
    WHERE s.employee_id = ? AND s.is_active = 1
    ORDER BY s.student_id DESC
      LIMIT ? OFFSET ?;
    `;
    const [data] = await db.query(sql, [employee_id, limit, offset]);
    const sqlSummary = `
    SELECT 
    COUNT(*) AS total_students,
      SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) AS total_male,
      SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) AS total_female
    FROM student_tbl s
    INNER JOIN (SELECT student_id, MAX(period_end) AS period_end
    FROM payment_tbl
    GROUP BY student_id) p ON s.student_id = p.student_id 
    AND p.period_end >= CURDATE()
    WHERE employee_id = ?
    AND is_active = 1;
   `;
    const [summaryResults] = await db.query(sqlSummary, [employee_id]);
    const summary = summaryResults[0];
    const totalPages = Math.ceil(summary.total_students / limit);

    return {
      data,
      summary,
      pagination: {
        currentPage: page,
        totalPages,
        limit,
      },
    };
  },

  getSearchStudentAt: async (keyword, page, limit, employee_id) => {
    const words = keyword.trim().split(/\s+/);
    let conditions = [];
    let params = [];

    words.forEach((word) => {
      conditions.push(`(s.first_name LIKE ? OR s.last_name LIKE ?)`);
      params.push(`%${word}%`, `%${word}%`);
    });

    const whereClause = conditions.length ? conditions.join(" AND ") : "1=1";
    const dataQuery = `
    SELECT 
    b.book_name,
    s.first_name,
    s.last_name,
    s.telephone,
    s.gender,
    c.class_name,
    MAX(sh.shift) AS shift,
    TIME_FORMAT(MAX(sh.start_time), '%H:%i') AS start_time,
    TIME_FORMAT(MAX(sh.end_time), '%H:%i') AS end_time
    
    FROM student_tbl s
    LEFT JOIN employee_tbl emp ON s.employee_id = emp.id
    LEFT JOIN book_tbl b ON s.book_id = b.book_id
    LEFT JOIN class_tbl c ON s.class_id = c.class_id
    LEFT JOIN shift_tbl sh ON s.student_id = sh.student_id
    WHERE s.employee_id = ?
    AND s.is_active = 1 AND ${whereClause}
    GROUP BY 
    emp.id,
    b.book_name,
    s.employee_id,
    s.student_id,
    s.first_name,
    s.last_name,
    s.telephone,
    s.gender,
    c.class_name,
    s.is_active,
    s.createdAt
    ORDER BY s.student_id DESC
    `;
    const countQuery = `
      
      SELECT COUNT(DISTINCT s.student_id) AS total
      FROM student_tbl s
      LEFT JOIN employee_tbl emp ON s.employee_id = emp.id
      LEFT JOIN book_tbl b ON s.book_id = b.book_id
      LEFT JOIN class_tbl c ON s.class_id = c.class_id
      LEFT JOIN shift_tbl sh ON s.student_id = sh.student_id
      WHERE s.employee_id = ?
      AND s.is_active = 1
      AND ${whereClause}

    `;
    const queryParams = [employee_id, ...params];
    const results = paginate({
      db,
      employee_id,
      page,
      dataQuery,
      countQuery,
      limit,
      params: queryParams,
    });
    return results;
  },

  insert: async (conn, data) => {
    const sql = `
            INSERT INTO student_tbl
             (class_id,employee_id,book_id, id_card, first_name, last_name, gender, dob, telephone,address, description,is_active,createdAt)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;
    const values = [
      data.class_id,
      data.employee_id,
      data.book_id,
      data.id_card,
      data.first_name,
      data.last_name,
      data.gender,
      data.dob,
      data.telephone,
      data.address,
      data.description,
      data.is_active ?? 1,
      data.createdAt,
    ];
    const [results] = await conn.query(sql, values);
    return {
      student_id: results.insertId,
      ...data,
    };
  },
  updateStudent: async (conn, student_id, data) => {
    const sql = `
            UPDATE student_tbl
            SET class_id = ?, employee_id = ?, book_id = ?, id_card = ?, first_name = ?, 
            last_name = ?, gender = ?, dob = ?, telephone = ?, address = ?, description = ?,
            is_active = ? WHERE student_id = ?
        `;
    const values = [
      data.student_id,
      data.class_id,
      data.employee_id,
      data.book_id,
      data.id_card,
      data.first_name,
      data.last_name,
      data.gender,
      data.dob,
      data.telephone,
      data.address,
      data.description,
      data.is_active ?? 1,
    ];

    const [results] = await conn.query(sql, values);
    return [results.affectedRows > 0];
  },
  deleteStudent: async (student_id) => {
    const sql = `
      UPDATE student_tbl SET is_active = 0 WHERE student_id = ?
    `;
    return await db.query(sql, [student_id]);
  },
  ReactivStudent: async (student_id) => {
    const sql = `
      UPDATE student_tbl SET is_active = 1 WHERE student_id = ?
    `;
    return await db.query(sql, [student_id]);
  },
};
module.exports = Student;
