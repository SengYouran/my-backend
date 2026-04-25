exports.expensesMiddleware = (req, res, next) => {
  const {
    category_id,
    expenses_date,
    expenses_amount,
    paid_by,
    expenses_description,
  } = req.body;
  if (
    !category_id ||
    !expenses_date ||
    !expenses_amount ||
    !paid_by ||
    !expenses_description
  ) {
    return res.status(500).json({ message: "Missing required fields" });
  }
  next();
};
