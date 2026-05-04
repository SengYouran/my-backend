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
  updateShift: async (conn, student_id, data) => {
    const sql = `
    UPDATE shift_tbl SET student_id = ?, shift = ?, start_time = ?, end_time = ?
    WHERE student_id = ? 
    `;
    const values = [
      student_id,
      data.shift,
      data.start_time,
      data.end_time,
      student_id,
    ];
    const [results] = await conn.query(sql, values);
    return [results.affectedRows > 0];
  },
};
module.exports = Shift;
