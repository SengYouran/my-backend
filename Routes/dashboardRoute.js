const express = require("express");
const router = express.Router();
const dashboardRoute = require("../Controllers/dashboardController");
const auth = require("../Middlewares/auth");
router.get("/", auth, dashboardRoute.getDataDashboard);
module.exports = router;
