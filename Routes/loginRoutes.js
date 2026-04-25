const express = require("express");
const router = express.Router();
const { login } = require("../controllers/loginController");

router.post("/", login);

router.get("/me", (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json(decoded);

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;