const db = require("../db");
const Class = {
  getClassName: async () => {
    const sql = `
    SELECT * FROM class_tbl
  `;
    const [rows] = await db.query(sql);
    return rows;
  },
};
module.exports = Class;
