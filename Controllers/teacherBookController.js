const db = require("../db");
const TeacherBook = require("../Models/teacherbook");
exports.getTeacherBook = async (req, res) => {
  try {
    const data = await TeacherBook.getTeacherBook();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Faild to fecth teacher book" });
  }
};
exports.insertTeacherBook = async (req, res) => {
  const connection = await db.getConnection();
  const { teacher_id, book_id } = req.body;
  if (!teacher_id || !book_id) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }
  try {
    await connection.beginTransaction();
    await TeacherBook.insertTeacherBook(connection, { teacher_id, book_id });
    await connection.commit();
    res.status(201).json({ message: "Successful insert teacher book" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
};
