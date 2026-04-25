const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/upload");
const employeeController = require("../Controllers/employeeControlloer");
const { login } = require("../Controllers/loginController");
router.get("/", employeeController.getAllEmployees);
router.get("/:id", employeeController.getOneEmployee);

router.post("/", upload.single("profile"), employeeController.insertEmployees);

router.put(
  "/:id",
  upload.single("profile"),
  employeeController.updateEmployees,
);

router.delete("/:id", employeeController.deleteEmployee);
router.post("/login", login);
module.exports = router;
