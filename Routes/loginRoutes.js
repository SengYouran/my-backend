const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { login } = require("../Controllers/loginController");
const auth = require("../Middlewares/auth");

// =====================
// LOGIN
// =====================
router.post("/", login);

// =====================
// ME
// =====================
router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

// =====================
// LOGOUT
// =====================
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken"); // FIX
  return res.json({ message: "Logged out" });
});

// =====================
// REFRESH TOKEN (NEW)
// =====================
router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      {
        employee_id: decoded.employee_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.sendStatus(403);
  }
});

module.exports = router;