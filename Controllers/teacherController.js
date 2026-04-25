const getTeacher = require("../Models/teacher");
const Teacher = require("../Models/teacher");
const db = require("../db");

exports.getAllTeachers = async (req, res) => {
  try {
    const data = await getTeacher.getAllTeachers();
    res.status(200).json(data);
  } catch (err) {
    console.log("GET TEACHER ERROR", err);
    res.status(500).json({ message: "Faild to fecth teacher" });
  }
};
exports.insertTeacher = async (req, res) => {
  const conn = await db.getConnection();
  const { employee_id, book_id, subject, qualification } = req.body;

  try {
    await conn.beginTransaction();
    // 1 check employee exists
    const [emp] = await conn.query(
      `SELECT id FROM employee_tbl WHERE id = ? AND is_active = 1`,
      [employee_id],
    );

    if (emp.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: "Employee not found" });
    }

    // 2 insert teacher
    await Teacher.insert(conn, {
      employee_id,
      book_id,
      subject,
      qualification,
    });

    await conn.commit();
    res.status(201).json({ message: "Teacher added successfully" });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};
