const express = require("express");
const router = express.Router();
const classRoute = require("../Controllers/classController");
router.get("/", classRoute.getClass);
module.exports = router;
