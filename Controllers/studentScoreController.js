const db = require("../db");
const StudentScore = require("../Models/studentScore");
exports.getStudentPoint = async (req, res) => {
  try {
    const teacher = parseInt(req.query.teacher);
    const book = parseInt(req.query.book);

    const data = await StudentScore.getStudentPoint(book, teacher);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.insertStudentScore = async (req, res) => {
  const conection = await db.getConnection();
  try {
    await conection.beginTransaction();
    const {
      student_id,
      book_id,
      attendance_point,
      question_point,
      total_point,
      point_date,
      remark,
    } = req.body;
    await StudentScore.insertScore(conection, {
      student_id,
      book_id,
      attendance_point,
      question_point,
      total_point,
      point_date,
      remark,
    });
    await conection.commit();
    res.status(201).json({ message: "Insert student score successfully" });
  } catch (err) {
    await conection.rollback();
    console.error("INSERT ERROR STUDENT SCORE:", err);
    res.status(500).json({ message: err.sqlMessage || err.message });
  } finally {
    conection.release();
  }
};
