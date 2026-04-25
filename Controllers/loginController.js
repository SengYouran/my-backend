const jwt = require("jsonwebtoken");
const Login_ERP = require("../Models/login");

module.exports = async (req, res) => {
  // =========================
  // CORS HEADERS (IMPORTANT)
  // =========================
  res.setHeader("Access-Control-Allow-Origin", "https://my-frontend-two-theta.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const email = String(req.body?.email || "").trim();
    const password = String(req.body?.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // =========================
    // FIND USER
    // =========================
    const user = await Login_ERP.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const dbPassword = String(user.password || "").trim();

    if (password !== dbPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // =========================
    // CREATE JWT
    // =========================
    const token = jwt.sign(
      {
        employee_id: user.employee_id,
        role: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // =========================
    // SET COOKIE (VERCEL SAFE)
    // =========================
    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=86400`
    );

    return res.status(200).json({
      message: "Login success",
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};