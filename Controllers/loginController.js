const jwt = require("jsonwebtoken");
const Login_ERP = require("../Models/login");

const login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim();
    const password = String(req.body.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await Login_ERP.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const dbPassword = String(user.password || "").trim();

    if (password !== dbPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { employee_id: user.employee_id, role: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login success" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };