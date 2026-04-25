const express = require("express");
const router = express.Router();
const { login } = require("../Controllers/loginController");
const auth = require("../Middlewares/auth" );

// POST /login
router.post("/", login);

// GET /login/me
router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

// POST /login/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
