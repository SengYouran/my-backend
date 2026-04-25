const express = require("express");
const router = express.Router();
const TeacherBookRoute = require("../Controllers/teacherBookController");
router.get("/", TeacherBookRoute.getTeacherBook);
router.post("/", TeacherBookRoute.insertTeacherBook);
module.exports = router;
