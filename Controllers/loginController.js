const Login_ERP = require("../Models/login");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1️⃣ check input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2️⃣ find user
    const inputEmail = email.trim();
    const user = await Login_ERP.getUserByEmail(inputEmail);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const inputPassword = password.trim();

    if (inputPassword !== user.password.trim()) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4️⃣ create JWT payload
    const payload = {
      employee_id: user.employee_id,
      role: user.roles,
    };

    // 5️⃣ sign JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 6️⃣ save JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true, // true when HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 7️⃣ response
    res.status(200).json({
      message: "Login success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };
