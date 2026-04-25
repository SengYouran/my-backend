const db = require("../db");
const Categories = {
  getCategory: async () => {
    const sql = `
            SELECT * FROM expenses_categories_tbl;
        `;
    const sqlExpense_type = `
      SELECT expense_type_id, code from expense_type
      `;
    const [rows] = await db.query(sql);
    const [rowsExpense_type] = await db.query(sqlExpense_type);
    return {
      results: rows,
      expenseType: rowsExpense_type,
    };
  },
  insertCategory: async (conn, data) => {
    const sql = `
        INSERT INTO expenses_categories_tbl 
        (categories_name, categories_description) VALUE (?,?)
    `;
    const values = [data.categories_name, data.categories_description];
    const [results] = await conn.query(sql, values);
    return {
      categories_id: results.insertId,
      ...data,
    };
  },
};
module.exports = Categories;
