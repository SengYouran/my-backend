exports.studentScoreMiddleware = (req, res, next) => {
  const {
    student_id,
    attendance_point,
    question_point,
    point_date,
  } = req.body;

  if (
    student_id == null ||
    attendance_point == null ||
    question_point == null ||
    !point_date
  ) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  // validate number
  if (
    isNaN(attendance_point) ||
    isNaN(question_point)
  ) {
    return res.status(400).json({
      message: "Point must be number",
    });
  }
  next();
};
