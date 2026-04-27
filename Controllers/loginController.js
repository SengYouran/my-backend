const jwt = require("jsonwebtoken");
const Login_ERP = require("../Models/login");

const login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim();
    const password = String(req.body.password || "").trim();

    const user = await Login_ERP.getUserByEmail(email);

    if (!user || password !== String(user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ACCESS TOKEN
    const accessToken = jwt.sign(
      {
        employee_id: user.employee_id,
        role: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // REFRESH TOKEN
    const refreshToken = jwt.sign(
      { employee_id: user.employee_id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // cookie only for refresh (NOT access token)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login success",
      accessToken,
      user: {
        employee_id: user.employee_id,
        role: user.roles,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };