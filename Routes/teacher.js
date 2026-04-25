const express = require("express");
const router = express.Router();
const routeTeacher = require("../Controllers/teacherController");
const routeDetailModal = require("../Controllers/teacherController");
router.get("/", routeTeacher.getAllTeachers);
router.post("/", routeDetailModal.insertTeacher);
module.exports = router;
