const Book = require("../Models/books");
exports.getAllBooks = async (req, res) => {
  try {
    const data = await Book.getAllBook();
    res.status(200).json(data);
  } catch (err) {
    console.log("GET ClASS ERROR", err);
    res.status(500).json({ message: "Faild to fecth class name" });
  }
};
