const express = require("express");
const router = express.Router();
const StudentAttendanceRoute = require("../Controllers/studentAttendanceController");
const {
  validateAttendance,
  verifyToken,
} = require("../Middlewares/validateAttendance");
router.get("/", StudentAttendanceRoute.getStudentAttendance);
router.post(
  "/",
  verifyToken,
  validateAttendance,
  StudentAttendanceRoute.insertStudentAttendance,
);
module.exports = router;
