const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { login } = require("../controllers/loginController");

// ======================
// LOGIN
// ======================
router.post("/", login);

// ======================
// ME (FIXED)
// ======================
router.get("/me", (req, res) => {
  try {
    const cookie = req.headers.cookie;

    if (!cookie) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const token = cookie
      .split(";")
      .find(c => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.json(decoded);

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;