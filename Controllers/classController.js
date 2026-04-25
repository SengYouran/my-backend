const Class = require("../Models/class");
const db = require("../db");
exports.getClass = async (req,res) => {
  try {
    const data = await Class.getClassName();
    res.status(200).json(data);
  } catch (err) {
    console.log("GET ClASS ERROR", err);
    res.status(500).json({ message: "Faild to fecth class name" });
  }
};
