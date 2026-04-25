const detialStudent = require("../Models/detailStudent");
exports.getDetailStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await detialStudent.getDetailStudent(id);
    res.status(200).json(data);
  } catch (err) {
    console.log("Missing request information detail student", err);
    res.status(500).json({ message: "Fail to fetch detail student" });
  }
};
