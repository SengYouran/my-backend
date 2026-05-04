const Student = require("../Models/students");
const StudentPayment = require("../Models/paymentStudent");
const db = require("../db");
const Shift = require("../Models/shift");
const { end } = require("pdfkit");
exports.getInforStudnet = async (req, res) => {
  try {
    const { role, employee_id } = req.user;
    const teacher_ID = parseInt(req.query.teacher) || 9;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let data;

    if (role === "Admin") {
      data = await Student.getAllStudent(teacher_ID, page, limit);
    } else if (role === "Teacher") {
      data = await Student.getStudentUderTeacher(employee_id, page, limit);
    } else if (role === "Accounting") {
      data = await Student.getAllStudent(page, limit);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.log("GET STUDENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.getSearchSutdentsAt = async (req, res) => {
  try {
    const { keyword } = req.query;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const employee_id = req.query.employee_id;
    const keywords = keyword.toLowerCase().trim();
    const data = await Student.getSearchStudentAt(
      keywords,
      page,
      limit,
      employee_id,
    );
    res.status(200).json(data);
  } catch (err) {
    console.error("ERROR 👉", err); // 👈 សំខាន់
    res.status(500).json({ message: err.message });
  }
};
exports.getOneStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Student.getOneStudent(id);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.sqlMessage || err.message });
  }
};
exports.insertStudent = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      class_id,
      employee_id,
      book_id,
      id_card,
      first_name,
      last_name,
      gender,
      dob,
      telephone,
      address,
      description,
      is_active,
      createdAt,
      shift,
      start_time,
      end_time,
    } = req.body;
    // Insert student
    const studentResult = await Student.insert(connection, {
      class_id,
      employee_id,
      book_id,
      id_card,
      first_name,
      last_name,
      gender,
      dob,
      telephone,
      address,
      description,
      is_active: is_active ?? 1,
      createdAt,
    });
    const student_id = studentResult.student_id;
    await Shift.insertShift(connection, {
      student_id,
      shift,
      start_time,
      end_time,
    });
    await connection.commit();

    res.status(201).json({ message: "Insert successful ✅", student_id });
  } catch (err) {
    await connection.rollback();
    console.error("INSERT ERROR:", err);
    res.status(500).json({ message: err.sqlMessage || err.message });
  } finally {
    connection.release();
  }
};
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  let connection = await db.getConnection();
  console.log("UPDATE PARAMS:", req.params);
  console.log("UPDATE BODY:", req.body);

  try {
    await connection.beginTransaction();

    const {
      class_id,
      employee_id,
      book_id,
      id_card,
      first_name,
      last_name,
      gender,
      dob,
      telephone,
      address,
      description,
      is_active,
      createdAt,
      shift,
      start_time,
      end_time,
    } = req.body;

    await Student.updateStudent(connection, id, {
      class_id,
      employee_id,
      book_id,
      id_card,
      first_name,
      last_name,
      gender,
      dob,
      telephone,
      address,
      description,
      is_active: is_active ?? 1,
      createdAt,
    });

    await Shift.updateShift(connection, id, {
      shift,
      start_time,
      end_time,
    });

    await connection.commit();

    res.status(200).json({
      message: "Update successful",
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({
      message: err.message || "Update transaction failed",
    });
  } finally {
    connection.release();
  }
};
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await Student.deleteStudent(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    await StudentPayment.deleteStudentPayment(id);
    await connection.commit();
    res.status(200).json({ message: "Student deleted successfully ✅" });
  } catch (err) {
    await connection.rollback();
    console.log(err);
    res
      .status(500)
      .json({ message: err.message || "Delete transaction failed ❌" });
  } finally {
    connection.release();
  }
};
exports.reactiveStudent = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await Student.ReactivStudent(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    await StudentPayment.ReactiveStudentPayment(id);
    await connection.commit();
    res.status(200).json({ message: "Reactive student is succssfully" });
  } catch (err) {
    await connection.rollback();
    console.log(err.message);
    res
      .status(500)
      .json({ message: err.message || "Reactive Student is failed" });
  } finally {
    connection.release();
  }
};
