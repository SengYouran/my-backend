const express = require("express");
const router = express.Router();
const categoryRoute = require("../Controllers/categoriesController");
router.get("/", categoryRoute.getCategories);
router.post("/", categoryRoute.insertCategories);
module.exports = router;
