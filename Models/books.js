const db = require("../db");
const Books = {
  getAllBook: async () => {
    const sql = `
            SELECT * from book_tbl;
        `;
    const [rows] = await db.query(sql);
    return rows;
  },
};
module.exports = Books;
