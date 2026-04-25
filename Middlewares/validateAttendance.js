exports.validateAttendance = (req, res, next) => {
  const { student_id, attendance_date, attendance_status } = req.body;
  if (!student_id || !attendance_date || !attendance_status) {
    return res.status(400).json({ message: "Missing request fields" });
  }
  if (!["Present", "Absent"].includes(attendance_status)) {
    return res.status(400).json({ message: "Attendance status invalid" });
  }
  next();
};
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  // verify token...
  next();
};
