const db = require("../db");
const paginate = require("../Utility/paginate");
const StudentPayment = {
  getStudentPaymentPaid: async (type, page = 1, limit = 10) => {
    // 1️⃣ Build condition
    let condition = "1=1";
    if (type === "Paid")
      condition = "sp.pay_status = 'Paid' AND sp.period_end >= CURDATE()";
    if (type === "Unpaid")
      condition = "sp.pay_status = 'Unpaid' AND sp.period_end >= CURDATE()";
    if (type === "OVERDUE")
      condition = "sp.pay_status = 'Unpaid' AND sp.period_end <= CURDATE()";
    if (type === "Monthly")
      condition = "sp.pay_type = 'Monthly' AND sp.period_end >= CURDATE()";
    if (type === "Yearly")
      condition = "sp.pay_type = 'Yearly' AND sp.period_end >= CURDATE()";

    // 2️⃣ Pagination queries
    const dataQuery = `
    SELECT 
      stu.student_id, stu.first_name, stu.last_name, stu.telephone, 
      sp.amount, sp.transport_fee, sp.pay_type, sp.transport_type, 
      sp.period_start, sp.period_end, sp.pay_status
    FROM student_tbl stu
    INNER JOIN payment_tbl sp ON stu.student_id = sp.student_id
    WHERE ${condition}
    ORDER BY sp.period_start DESC
  `;
    const countQuery = `
    SELECT COUNT(*) AS total_student_payment
    FROM student_tbl stu
    INNER JOIN payment_tbl sp ON stu.student_id = sp.student_id
    WHERE ${condition}
  `;

    // 4️⃣ Run queries in parallel
    const [totalPagination] = await Promise.all([
      paginate({
        db,
        dataQuery,
        countQuery,
        page,
        limit,
        params: [],
      }),
    ]);

    // 5️⃣ Return combined object
    return {
      results: totalPagination.results,
      pagination: totalPagination.pagination,
    };
  },
  getStudentSearch: async (keyword, page, limit) => {
    const offset = (page - 1) * limit;
    const searchKeyword = `%${keyword}%`;
    const sql = `
      SELECT student_id, first_name, last_name
      FROM student_tbl
      WHERE is_active = 1
      AND (first_name LIKE ? OR last_name LIKE ?)
      ORDER BY student_id DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.query(sql, [
      searchKeyword,
      searchKeyword,
      limit,
      offset,
    ]);
    return rows;
  }, //check search
  getStudentPaymentPaidByDate: async (start, end, page = 1, limit = 10) => {
    const dataQuery = `
    SELECT 
      stu.student_id,
      stu.first_name,
      stu.last_name,
      stu.telephone,
      sp.amount,
      sp.pay_type,
      sp.period_start,
      sp.period_end,
      sp.pay_status,
      sp.transport_type,
      sp.transport_fee,
      sp.created_at
    FROM payment_tbl sp
    INNER JOIN student_tbl stu 
      ON stu.student_id = sp.student_id
    WHERE sp.created_at BETWEEN ? AND ?
    ORDER BY sp.created_at DESC
  `;

    const countQuery = `
    SELECT COUNT(*) AS total_count
    FROM payment_tbl sp
    INNER JOIN student_tbl stu 
      ON stu.student_id = sp.student_id
    WHERE sp.created_at BETWEEN ? AND ?
  `;

    const results = await paginate({
      db,
      dataQuery,
      countQuery,
      limit,
      page,
      params: [start, end],
    });

    return results;
  },
  getSearchStudentPaidUnpaid: async (keyword, page, limit) => {
    const words = keyword.trim().split(/\s+/);

    let conditions = [];
    let params = [];

    words.forEach((word) => {
      conditions.push(`(stu.first_name LIKE ? OR stu.last_name LIKE ?)`);
      params.push(`%${word}%`, `%${word}%`);
    });
    // sp.period_end >= CURDATE() AND if we wnat to set student current active
    const whereClause = conditions.join(" AND ");

    const dataQuery = `
    SELECT 
      stu.first_name,
      stu.last_name,
      stu.telephone,
      sp.amount,
      sp.pay_type,
      sp.period_start,
      sp.period_end,
      sp.pay_status,
      sp.transport_type,
      sp.transport_fee,
      sp.created_at
    FROM payment_tbl sp
    INNER JOIN student_tbl stu 
      ON stu.student_id = sp.student_id
    WHERE ${whereClause}
    ORDER BY sp.created_at DESC
  `;

    const countQuery = `
    SELECT COUNT(*) AS total_count
    FROM payment_tbl sp
    INNER JOIN student_tbl stu 
      ON stu.student_id = sp.student_id
    WHERE sp.period_end >= CURDATE() 
    AND ${whereClause}
  `;

    const results = await paginate({
      db,
      dataQuery,
      countQuery,
      page,
      limit,
      params,
    });

    return results;
  },
  insertStudent: async (conn, data) => {
    const sql = `
        INSERT INTO payment_tbl
(student_id, amount, pay_type, period_start, period_end, pay_status,transport_type,transport_fee,is_active)
VALUES (?,?,?,?,?,?,?,?,?)
        `;
    const values = [
      data.student_id,
      data.amount,
      data.pay_type,
      data.period_start,
      data.period_end,
      data.pay_status,
      data.transport_type,
      data.transport_fee,
      data.is_active,
    ];
    const [result] = await conn.query(sql, values);
    return {
      payment_id: result.insertStudent,
      ...data,
    };
  },
  updatePaymentStudentModel: async (conn, student_id, data) => {
    let updated = `
    UPDATE payment_tbl 
    SET student_id = ?, 
        amount = ?, 
        pay_type = ?, 
        period_start = ?,
        period_end = ?, 
        pay_status = ?, 
        transport_type = ?, 
        transport_fee = ?, 
        is_active = ?
    WHERE student_id = ?
  `;

    const values = [
      data.student_id,
      data.amount,
      data.pay_type,
      data.period_start,
      data.period_end,
      data.pay_status,
      data.transport_type,
      data.transport_fee,
      data.is_active || 1,
      student_id, 
    ];

    const [results] = await conn.query(updated, values);

    return [results.affectedRows > 0];
  },
  deleteStudentPayment: async (student_id) => {
    const sql = `
      UPDATE payment_tbl SET is_active = 0, pay_status = "Unpaid" WHERE student_id = ?
    `;
    return await db.query(sql, [student_id]);
  },
  ReactiveStudentPayment: async (student_id) => {
    const sql = `
      UPDATE payment_tbl SET is_active = 1, pay_status = "Paid" WHERE student_id = ?
    `;
    return await db.query(sql, [student_id]);
  },
};
module.exports = StudentPayment;
