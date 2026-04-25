const jwt = require("jsonwebtoken");
const Login_ERP = require("../Models/login");

const login = async (req, res) => {
  try {
    console.log("LOGIN HIT");
    console.log("BODY:", req.body);

    const email = String(req.body.email || "").trim();
    const password = String(req.body.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await Login_ERP.getUserByEmail(email);

    console.log("USER:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (password !== String(user.password).trim()) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { employee_id: user.employee_id, role: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=None`
    );

    return res.json({ message: "Login success" });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

module.exports = { login };