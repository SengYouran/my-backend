const express = require("express");
const router = express.Router();
const StudentPaymentRoute = require("../Controllers/StudentPaymentController");
router.get("/", StudentPaymentRoute.getStudentPayPaid);
router.get("/filterByDate", StudentPaymentRoute.filterStudentPaymentByDate);
router.get(
  "/searchStudentPayment",
  StudentPaymentRoute.getStudentPaymentSearch,
);
router.get(
  "/searchpaidunpaid",
  StudentPaymentRoute.getSearchStudentPaidUnpaidCTL,
);
router.post("/", StudentPaymentRoute.insertStudentPayment);
router.put("/:id",StudentPaymentRoute.updatePayment)
module.exports = router;
