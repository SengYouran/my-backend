const DashboardAdmin = require("../Models/dashboardAdmin");
const DashboardTeacher = require("../Models/dashboardTeacher");
const DashboardAccounting = require("../Models/dashboardAccounting");
const db = require("../db");
exports.getDataDashboard = async (req, res) => {
  try {
    const { role, employee_id } = req.user;
    let data;
    if (role === "Admin") {
      data = await DashboardAdmin.getDataDashboard();
    } else if (role === "Accounting") {
      data = await DashboardAccounting.getDataDashboardAccounting();
    } else if (role === "Teacher") {
      data = await DashboardTeacher.getDataDashboardTeacher(employee_id);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.log("GET DATA DASHBOARD ERROR", err);
    res.status(500).json({ message: err });
  }
};
