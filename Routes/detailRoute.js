const express = require("express");
const router = express.Router();
const detailStudentMiddleware = require("../Middlewares/detailMiddleware");
const detailStudentController = require("../Controllers/detailStudentController");
router.get(
  "/:id",
  detailStudentMiddleware,
  detailStudentController.getDetailStudent,
);
module.exports = router;
