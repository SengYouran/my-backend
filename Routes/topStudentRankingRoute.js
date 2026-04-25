const express = require("express");
const router = express.Router();
const topstudentRank = require("../Controllers/topStudentRankController");
router.get("/", topstudentRank.getTopStudentRank);
module.exports = router;
