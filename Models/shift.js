const db = require("../db");
const Shift = {
  insertShift: async (conn, data) => {
    const sql = `
            INSERT INTO shift_tbl (student_id, shift, start_time, end_time) values (?,?,?,?)
        `;
    const values = [
      data.student_id,
      data.shift,
      data.start_time,
      data.end_time,
    ];
    const [results] = await conn.query(sql, values);
    return {
      student_id: results.insertShift,
      ...data,
    };
  },
};
module.exports = Shift;
