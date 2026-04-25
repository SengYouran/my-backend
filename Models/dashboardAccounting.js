const db = require("../db");

const DashboardAccounting = {
  getDataDashboardAccounting: async () => {
    const sqlTotalPaidUnpaid = `
      SELECT 
        SUM(CASE WHEN p.pay_status = 'Paid' AND p.period_end > CURDATE() THEN 1 ELSE 0 END) AS total_paid_active,
        SUM(CASE WHEN p.pay_status = 'Unpaid' AND p.period_end > CURDATE() THEN 1 ELSE 0 END) AS total_unpaid_active,
        SUM(CASE WHEN p.pay_status = 'Unpaid' AND p.period_end <= CURDATE() THEN 1 ELSE 0 END) AS total_overdue
      FROM payment_tbl p
    `;
    const sqlAmountMonthYear = `
      SELECT 
      SUM(CASE WHEN p.pay_type = 'Monthly' THEN p.amount ELSE 0 END) AS total_amount_monthly,
      SUM(CASE WHEN p.pay_type = 'Yearly' THEN p.amount ELSE 0 END) AS total_amount_yearly,
      SUM(CASE WHEN p.pay_type = 'Yearly' THEN p.transport_fee ELSE 0 END) AS total_amount_Yearly_transport,
		  SUM(CASE WHEN p.pay_type = 'Monthly' THEN p.transport_fee ELSE 0 END) AS total_amount_Monthly_transport
      FROM payment_tbl p
    `;
    const sqlAmountStudentRegister = `
      SELECT 
      DATE_FORMAT(period_start, '%Y-%m') AS month,
      SUM(amount) AS total_amount,
      SUM(transport_fee) AS total_transport_fee
      FROM payment_tbl
      WHERE period_start >= '2026-01-01'
      AND period_start < '2027-01-01'
      GROUP BY month
      ORDER BY month
    `;
    const sqlExpenses = `
      SELECT 
      DATE_FORMAT(expenses_date, '%Y-%m') AS month,
      SUM(expenses_amount) AS total_amount
      FROM expenses_tbl
      WHERE expenses_date BETWEEN '2026-01-01' AND '2027-01-01'
      GROUP BY month
      ORDER BY month;
    `;
   
    const [
      paid_unpaid_students,
      register_tranpsort_amount,
      chart_student_amount,
      
      chart_expenses,
    ] = await Promise.all([
      db.query(sqlTotalPaidUnpaid),
      db.query(sqlAmountMonthYear),
      db.query(sqlAmountStudentRegister),
      db.query(sqlExpenses),
    ]);
    return {
      total_paid_unpaid_student: paid_unpaid_students[0][0],
      total_month_year_register_transport: register_tranpsort_amount[0][0],
      chart_total_student_amount: chart_student_amount[0],
      chart_total_expenses: chart_expenses[0],
    };
  },
};
module.exports = DashboardAccounting;
