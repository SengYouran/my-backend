require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// =======================
// ✅ CORS CONFIG (FIXED)
// =======================
const corsOptions = {
  origin: "https://my-frontend-two-theta.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ IMPORTANT: handle preflight correctly
app.options("*", cors(corsOptions));

// =======================
// middleware
// =======================
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// =======================
// routes
// =======================
const employeesRoutes = require("./Routes/employeeRoutes");
const loginrouter = require("./Routes/loginRoutes");
const teacherRoute = require("./Routes/teacher");
const classRoute = require("./Routes/classRoute");
const studentRoute = require("./Routes/studentRoute");
const bookRoute = require("./Routes/bookRoute");
const studentPaymentRoute = require("./Routes/studentPaymentRoute");
const studentAttendanceRoute = require("./Routes/StudnetAttendanceRoute");
const studentScoreRoute = require("./Routes/studentScoreRoute");
const teacherBookRoute = require("./Routes/teacherBookRoute");
const expensesRoute = require("./Routes/expensesRoute");
const categoryRoute = require("./Routes/categoriesRoute");
const topStudentRankRoute = require("./Routes/topStudentRankingRoute");
const dashboardRoute = require("./Routes/dashboardRoute");
const detailStudentRoute = require("./Routes/detailRoute");
const reportingRoute = require("./Routes/reportingRoute");
const notificationRoute = require("./Routes/notificationRoute");

// =======================
// mount routes
// =======================
app.use("/login", loginrouter);
app.use("/student", studentRoute);
app.use("/employees", employeesRoutes);
app.use("/teacher", teacherRoute);
app.use("/class", classRoute);
app.use("/book", bookRoute);
app.use("/payment", studentPaymentRoute);
app.use("/attendance", studentAttendanceRoute);
app.use("/point", studentScoreRoute);
app.use("/teacherBook", teacherBookRoute);
app.use("/expenses", expensesRoute);
app.use("/categories", categoryRoute);
app.use("/topstudentrank", topStudentRankRoute);
app.use("/dashboard", dashboardRoute);
app.use("/detailStudent", detailStudentRoute);
app.use("/reports", reportingRoute);
app.use("/notification", notificationRoute);

console.log("DB HOST:", process.env.MYSQLHOST);
console.log("DB USER:", process.env.MYSQLUSER);
console.log("DB NAME:", process.env.MYSQLDATABASE);

module.exports = app;