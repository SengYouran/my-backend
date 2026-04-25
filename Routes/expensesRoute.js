const express = require("express");
const router = express.Router();
const expensesRoute = require("../Controllers/expensesController");
const { expensesMiddleware } = require("../Middlewares/expenses");
router.get("/", expensesRoute.getExpenses);
router.get("/typeExpense",expensesRoute.getTpyeExpense)
router.post("/", expensesMiddleware, expensesRoute.insertExpenses);
module.exports = router;
