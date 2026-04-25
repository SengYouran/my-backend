const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
// ✅ import controller
const {
  downloadExcel,
  downloadPDF,
  getReportings,
} = require("../Controllers/reportingController");
router.get("/", getReportings);
router.get("/excel", downloadExcel);
router.get("/pdf", downloadPDF);

module.exports = router;
