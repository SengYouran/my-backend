const TopStudentRanking = require("../Models/topStudentRanking");
exports.getTopStudentRank = async (req, res) => {
  try {
    const employee_id = parseInt(req.query.teacher);
    const data = await TopStudentRanking.studentRank(employee_id);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fail to fetch top student ranking" });
  }
};
