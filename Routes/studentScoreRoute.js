const express = require("express");
const router = express.Router();
const StudentScoreRoute = require("../Controllers/studentScoreController");
const { studentScoreMiddleware } = require("../Middlewares/studentScore");
router.get("/", StudentScoreRoute.getStudentPoint);
router.post("/", studentScoreMiddleware, StudentScoreRoute.insertStudentScore);
module.exports = router;
