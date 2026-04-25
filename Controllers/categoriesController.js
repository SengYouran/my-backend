const db = require("../db");
const Category = require("../Models/categories");
exports.getCategories = async (req, res) => {
  try {
    const data = await Category.getCategory();
    res.status(200).json(data);
  } catch (err) {
    console.log("Missing to fetch categories");
    res.status(500).json({ message: "Fail to fetch expenses categories" });
  }
};
exports.insertCategories = async (req, res) => {
  const connection = await db.getConnection();
  const { categories_name, categories_description } = req.body;
  try {
    await connection.beginTransaction();
    await Category.insertCategory(connection, {
      categories_name,
      categories_description,
    });
    res.status(201).json({ message: "Insert to categories is successfully" });
  } catch (err) {
    await connection.rollback();
    console.log("Missing to insert expenses categories");
    res.status(500).json({ message: err.sqlMessage || err.message });
  } finally {
    connection.release();
  }
};
