const db = require("../db");
const StudentAttendance = require("../Models/studentAttendance");
exports.getStudentAttendance = async (req, res) => {
  try {
    const employee_id = parseInt(req.query.employeeID);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const data = await StudentAttendance.getStudentAttendances(
      employee_id,
      page,
      limit,
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.insertStudentAttendance = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { student_id, attendance_date, attendance_status, description } =
      req.body;
    await StudentAttendance.insertAttendance(connection, {
      student_id,
      attendance_date,
      attendance_status,
      description,
    });
    await connection.commit();
    res.status(201).json({ message: "Insert Student's Attendacn Succesfully" });
  } catch (err) {
    await connection.rollback();
    console.error("INSERT ERROR Sutdent Attendance error:", err);
    res.status(500).json({ message: err.sqlMessage || err.message });
  } finally {
    connection.release();
  }
};
