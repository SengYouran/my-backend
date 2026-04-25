const express = require("express");
const router = express.Router();
const bookRoute = require("../Controllers/bookController");
router.get("/", bookRoute.getAllBooks);
module.exports = router;
