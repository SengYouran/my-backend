const db = require("../db");
const paginate = require("../Utility/paginate");

const Reporting = {
  getReporting: async (
    type,
    limit,
    page,
    exportMode = false,
    startDate = null,
    endDate = null,
    employee_id,
    book_id,
  ) => {
    const params = [];

    // filter current month for this month reporting
    let currentMonthFilter = "";
    if (
      (startDate === null && endDate === null && type === "Income") ||
      (startDate === null && endDate === null && type === "Unpaid")
    ) {
      currentMonthFilter = `
      AND sp.created_at >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
      AND sp.created_at < DATE_FORMAT(CURRENT_DATE() + INTERVAL 1 MONTH, '%Y-%m-01')
    `;
      //params.push(startDate, endDate);
    }
    const currentMonthFilterExpense = `
      exp.created_at >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
      AND exp.created_at < DATE_FORMAT(CURRENT_DATE() + INTERVAL 1 MONTH, '%Y-%m-01')
    `;

    // ================== DYNAMIC FILTER ==================
    let additionalFilter = "";
    if (
      (startDate && endDate && type === "Income") ||
      (startDate && endDate && type === "Unpaid")
    ) {
      additionalFilter += `AND sp.period_start >= ? AND sp.period_end <= ? `;
      params.push(startDate, endDate);
    }
    let additionalFilterEP = "";
    if (startDate && endDate && type === "Expenses") {
      additionalFilterEP += `AND exp.expenses_date >= ? AND exp.expenses_date <= ?`;
      params.push(startDate, endDate);
    }

    let currentMonthFilterAttendance = "";
    if (startDate === null && endDate === null && type === "Attendance") {
      currentMonthFilterAttendance = `
      AND stu.employee_id = ?
      AND att.attendance_date >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
      AND att.attendance_date <= DATE_FORMAT(CURRENT_DATE() + INTERVAL 1 MONTH, '%Y-%m-01')
      `;
      params.push(employee_id);
    }
    let additionalFiltetAttendance = "";
    if (startDate && endDate && type === "Attendance") {
      additionalFilterEP += `AND att.attendance_date >= ? AND att.attendance_date <= ?`;
      params.push(startDate, endDate);
    }
    let currentMonthFilterScore = "";
    if (startDate === null && endDate === null && type === "Score") {
      currentMonthFilterScore += `
        sp.book_id = ?
        AND stu.employee_id = ?
        AND DATE_FORMAT(sp.point_date, '%Y-%m') = (
		SELECT MAX(DATE_FORMAT(point_date, '%Y-%m'))
		FROM point_tbl)
      `;
      params.push(book_id, employee_id);
    }
    let additionalFiltetScore = "";
    if (startDate && endDate && type === "Score") {
      additionalFiltetScore += `
        sp.book_id = ?
        AND stu.employee_id = ? AND 
        sp.point_date >= ? AND sp.point_date <= ?`;
      params.push(book_id, employee_id, startDate, endDate);
    }
    let dataQuery = "";
    let countQuery = "";

    // ================== INCOME ==================
    if (type === "Income") {
      dataQuery = `
        SELECT 
          stu.student_id, 
          stu.first_name, 
          stu.last_name, 
          stu.telephone, 
          sp.amount, 
          sp.transport_fee, 
          sp.pay_type, 
          sp.transport_type, 
          sp.period_start, 
          sp.period_end, 
          sp.pay_status,
          sp.created_at,
          SUM(sp.amount + sp.transport_fee) OVER() AS total_income
        FROM student_tbl stu
        INNER JOIN payment_tbl sp 
          ON stu.student_id = sp.student_id
        WHERE sp.pay_status = 'Paid' ${currentMonthFilter} ${additionalFilter}
        ORDER BY sp.period_start DESC
      `;

      countQuery = `
        SELECT COUNT(*) AS total_student_payment
        FROM student_tbl stu
        INNER JOIN payment_tbl sp 
          ON stu.student_id = sp.student_id
        WHERE sp.pay_status = 'Paid' ${currentMonthFilter} 
        ${additionalFilter}
      `;
    }

    // ================== UNPAID ==================
    else if (type === "Unpaid") {
      dataQuery = `
        SELECT 
          stu.student_id, 
          stu.first_name, 
          stu.last_name, 
          stu.telephone, 
          sp.amount, 
          sp.transport_fee, 
          sp.pay_type, 
          sp.transport_type, 
          sp.period_start, 
          sp.period_end, 
          sp.pay_status,
          sp.created_at,
          SUM(sp.amount + sp.transport_fee) OVER() AS total_unpaid
        FROM student_tbl stu
        INNER JOIN payment_tbl sp 
          ON stu.student_id = sp.student_id
        WHERE 
           sp.pay_status = 'Unpaid' AND sp.period_end >= CURDATE()
          ${additionalFilter}
        ORDER BY sp.period_start DESC
      `;

      countQuery = `
        SELECT COUNT(*) AS total_unpaid
        FROM student_tbl stu
        INNER JOIN payment_tbl sp 
          ON stu.student_id = sp.student_id
        WHERE 
          sp.pay_status = 'Unpaid'
          AND sp.pay_status = 'Unpaid' AND sp.period_end >= CURDATE()
           ${additionalFilter}
      `;
    }

    // ================== EXPENSE ==================
    else if (type === "Expenses") {
      dataQuery = `
        SELECT 
          ctg.categories_name, 
          exp.expenses_date, 
          exp.expenses_amount,
          exp.paid_by, 
          exp.expenses_description,
          exp.created_at,
          SUM(exp.expenses_amount) OVER() AS total_expense
        FROM expenses_tbl exp
        LEFT JOIN expenses_categories_tbl ctg 
          ON exp.category_id = ctg.categories_id
        WHERE ${currentMonthFilterExpense} ${additionalFilterEP.replace(/sp\./g, "exp.")}
        ORDER BY exp.created_at DESC
      `;

      countQuery = `
        SELECT COUNT(*) AS total_expense
        FROM expenses_tbl exp
        WHERE ${currentMonthFilterExpense} ${additionalFilterEP.replace(/sp\./g, "exp.")}
      `;
    } else if (type === "Attendance") {
      dataQuery = `
      SELECT stu.employee_id, stu.last_name, stu.first_name, stu.telephone,
      DATE_FORMAT(att.attendance_date, '%Y-%m-%d') AS attendance_date,
      att.attendance_status, att.description
      FROM student_tbl stu
      LEFT JOIN student_attendance_tbl att 
      ON stu.student_id = att.student_id
      WHERE att.attendance_status = "Absent"
      ${currentMonthFilterAttendance} ${additionalFiltetAttendance}
      ORDER BY stu.employee_id DESC
      `;
      countQuery = `
      SELECT COUNT(*) AS total
      FROM student_attendance_tbl att
      LEFT JOIN student_tbl stu 
      ON att.student_id = stu.student_id
      WHERE att.attendance_status = "Absent"
      ${currentMonthFilterAttendance} ${additionalFiltetAttendance}
      `;
    } else if (type === "Score") {
      dataQuery = `
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
        WHERE ${currentMonthFilterScore} ${additionalFiltetScore}
        GROUP BY stu.student_id, stu.employee_id, stu.last_name, stu.first_name, sp.remark
        ORDER BY total_points DESC
      `;
      countQuery = `
      SELECT COUNT(*) AS total
      FROM point_tbl sp
      LEFT JOIN student_tbl stu 
      ON sp.student_id = stu.student_id
      WHERE ${currentMonthFilterScore} ${additionalFiltetScore}
      `;
    }
    // ================== DEFAULT ==================
    else {
      throw new Error("Invalid report type");
    }
    // ================== EXECUTE ==================
    let results;

    if (exportMode || limit === 0) {
      // Export mode OR limit = 0 → fetch all
      results = await db.query(dataQuery, params);
    } else {
      // Normal paginated fetch
      results = await paginate({
        db,
        dataQuery,
        countQuery,
        limit,
        page,
        params,
      });
    }

    return exportMode || limit === 0 ? results[0] : results;
  },
};

module.exports = Reporting;
