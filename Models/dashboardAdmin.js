const db = require("../db");

const DashboardAdmin = {
  getDataDashboard: async () => {
    const sqlAmount = `
    SELECT 
    SUM(p.amount) AS total_amount_month_year,
    SUM(p.amount + p.transport_fee) AS total_income,
    SUM(p.transport_fee) AS total_transport_month_year,
    (
        SELECT SUM(amount) FROM payment_tbl
    ) - (
        SELECT SUM(expenses_amount) FROM expenses_tbl
    ) AS net_profit
    FROM payment_tbl p;
    `;

    const sqlChartAmount = `
      SELECT 
        DATE_FORMAT(period_start, '%Y-%m') AS month,
        pay_type,
        SUM(amount + transport_fee) AS total_register_transport_fee
      FROM payment_tbl
      WHERE period_start >= '2026-01-01'
        AND period_start < '2027-01-01'
      GROUP BY month, pay_type
      ORDER BY month
    `;

    const sqlTotalPaidUnpaid = `
      SELECT 
        SUM(CASE WHEN p.pay_status = 'Paid' AND p.period_end > CURDATE() THEN 1 ELSE 0 END) AS total_paid_active,
        SUM(CASE WHEN p.pay_status = 'Unpaid' AND p.period_end > CURDATE() THEN 1 ELSE 0 END) AS total_unpaid_active,
        SUM(CASE WHEN p.pay_status = 'Unpaid' AND p.period_end <= CURDATE() THEN 1 ELSE 0 END) AS total_overdue
      FROM payment_tbl p
    `;
    const totalStudent_Active = `
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
    WHERE p.period_end >= CURDATE() AND s.is_active = 1;`;
    const sqlActiveDeactive = `
    SELECT 
    DATE_FORMAT(createdAt, '%Y-%m') AS month,
    SUM(is_active = 1) AS total_active,
    SUM(is_active = 0) AS total_deactive
    FROM student_tbl 
    WHERE YEAR(createdAt) = 2026
    GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
    ORDER BY month;
    `;
    const sqlBook = `
        SELECT 
        b.book_name,
        COUNT(s.student_id) AS total_students
        FROM book_tbl b
        LEFT JOIN student_tbl s ON b.book_id = s.book_id
        INNER JOIN (SELECT student_id, MAX(period_end) AS period_end
        FROM payment_tbl GROUP BY student_id)
        p ON s.student_id = p.student_id 
        AND period_end >= CURDATE()
        where is_active = 1
        GROUP BY b.book_id, b.book_name
        ORDER BY b.book_name;
        `;
    const sqlTotal_Expenses = `
      SELECT SUM(expenses_amount) AS total_expenses
      FROM expenses_tbl
      WHERE expenses_date >= '2026-01-01'
      AND expenses_date < '2027-01-01';
    `;
    const [
      amountResult,
      chartResult,
      paidResult,
      student_active,
      chartActive_deactive,
      summaryBook,
      total_expenses,
    ] = await Promise.all([
      db.query(sqlAmount),
      db.query(sqlChartAmount),
      db.query(sqlTotalPaidUnpaid),
      db.query(totalStudent_Active),
      db.query(sqlActiveDeactive),
      db.query(sqlBook),
      db.query(sqlTotal_Expenses),
    ]);

    return {
      summary: amountResult[0][0],
      chartAmount: chartResult[0],
      totalPaidUnpaid: paidResult[0][0],
      total_active_student: student_active[0][0],
      chart_Active_Deactive: chartActive_deactive[0],
      chart_level_book: summaryBook[0],
      total_expenses: total_expenses[0][0],
    };
  },
};

module.exports = DashboardAdmin;
