const Expenses = require("../Models/expenses");
const db = require("../db");
exports.getExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const data = await Expenses.getExpenses(page, limit);
    res.status(200).json(data);
  } catch (err) {
    console.log("GET EXPENSES ERROR", err);
    res.status(500).json({ message: "Fail to fetch expenses" });
  }
};
exports.getTpyeExpense = async (req, res) => {
  try {
    const data = await Expenses.getTypeExpense();
    res.status(200).json(data);
  } catch (err) {
    console.log("GET TYPE EXPENSE ERROR");
    res.status(500).json({ message: "Fail to fetch type expense" });
  }
};
exports.insertExpenses = async (req, res) => {
  const connection = await db.getConnection();
  const {
    category_id,
    expense_type_id,
    expenses_date,
    expenses_amount,
    paid_by,
    expenses_description,
  } = req.body;
  try {
    await connection.beginTransaction();
    await Expenses.insertExpenses(connection, {
      category_id,
      expense_type_id,
      expenses_date,
      expenses_amount,
      paid_by,
      expenses_description,
    });
    await connection.commit();
    res.status(201).json({ message: "Insert to expenses is succesfully" });
  } catch (err) {
    await connection.rollback();
    console.log("Missing to insert expenses");
    res.status(500).json({ message: err.sqlMessage || err.message });
  } finally {
    connection.release();
  }
};
