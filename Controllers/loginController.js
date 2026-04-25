const Login_ERP = require("../Models/login");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = (email || "").trim();
    password = (password || "").trim();

    const user = await Login_ERP.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const dbPassword = String(user.password || "").trim();

    console.log("INPUT:", password);
    console.log("DB:", dbPassword);

    if (password !== dbPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login success",
      user: {
        id: user.employee_id,
        role: user.roles,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };
