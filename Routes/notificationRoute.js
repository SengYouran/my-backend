const express = require("express");
const router = express.Router();
const notification = require("../Controllers/notificationController");
router.get("/receiver", notification.getReceiver);
router.get("/", notification.getNotification);
router.post("/", notification.insertNotificaton);
router.put("/markread/:id", notification.markReadMessageController);
module.exports = router;
