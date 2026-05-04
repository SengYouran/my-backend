const express = require("express");
const router = express.Router();
const studentRoutes = require("../Controllers/studentController");
const auth = require("../Middlewares/auth");

router.get("/", auth, studentRoutes.getInforStudnet);
router.get("/searchStudent", studentRoutes.getSearchSutdentsAt);
router.get("/:id", auth, studentRoutes.getOneStudent);
router.post("/", studentRoutes.insertStudent);
router.put("/:id", auth, studentRoutes.updateStudent);
router.put("/:id/delete", auth, studentRoutes.deleteStudent);

router.put("/:id/reactive", auth, studentRoutes.reactiveStudent);

module.exports = router;
