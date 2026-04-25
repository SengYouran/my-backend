const db = require("../db");
const paginate = require("../Utility/paginate");
const Expenses = {
  getExpenses: async (page, limit) => {
    const selectYare = new Date().getFullYear();
    const dataQuery = `
    SELECT ctg.categories_name, exp.expenses_date, exp.expenses_amount,
    exp.paid_by, exp.expenses_description,et.code
    FROM expenses_tbl exp
    LEFT JOIN expenses_categories_tbl ctg ON exp.category_id = ctg.categories_id
    LEFT JOIN expense_type et ON exp.expense_type_id = et.expense_type_id
    WHERE YEAR(expenses_date) = ?
    `;
    const countQuery = `
    SELECT COUNT(*) AS total_expenses
    FROM expenses_tbl exp
    WHERE YEAR(exp.expenses_date) = ?
  `;
    const paginateData = await paginate({
      db,
      dataQuery,
      countQuery,
      page,
      limit,
      params: [selectYare],
    });

    return {
      results: paginateData.results,
      pagination: paginateData.pagination,
    };
  },
  getTypeExpense: async () => {
    const sqlTypeExpense = `
       SELECT * FROM project.expense_type;
    `;
    const [results] = await db.query(sqlTypeExpense);
    return results;
  },
  insertExpenses: async (conn, data) => {
    const sql = `
        INSERT INTO expenses_tbl 
        (category_id, expense_type_id, expenses_date, expenses_amount, paid_by, expenses_description)
        VALUE
        (?,?,?,?,?,?)
    `;
    const values = [
      data.category_id,
      data.expense_type_id,
      data.expenses_date,
      data.expenses_amount,
      data.paid_by,
      data.expenses_description,
    ];
    const [results] = await conn.query(sql, values);
    return {
      expenses_id: results.insertId,
      ...data,
    };
  },
};
module.exports = Expenses;
