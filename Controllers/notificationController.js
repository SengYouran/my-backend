const Notification = require("../Models/notification");
const db = require("../db");

exports.getReceiver = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const data = await Notification.getReceiver(page, limit);
    res.status(200).json(data);
  } catch (err) {
    console.log("Error to fetch reciver", err);
    res.status(500).json({ message: err.sqlMessage || err.message });
  }
};
exports.getNotification = async (req, res) => {
  try {
    const receiverId = req.query.employee_id;
    const data = await Notification.getNotification(receiverId);
    res.status(200).json(data);
  } catch (err) {
    console.log("Fail to fetching notification", err);
    res.status(500).json({ message: err.sqlMessage || err.message });
  }
};
exports.markReadMessageController = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    await Notification.markreadMessageNotification(id);
    res.status(201).json({ message: "Marked as read" });
  } catch (err) {
    await connection.rollback();
    console.log("Error Mark Read Notification", err);
    res.status(500).json({ message: err.sqlMessage || err.message });
  } finally {
    connection.release();
  }
};
exports.insertNotificaton = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { sender_id, receiver_id, title, descriptions } = req.body;
    await connection.beginTransaction();
    await Notification.insertNotificationModel(connection, {
      sender_id,
      receiver_id,
      title,
      descriptions,
    });
    await connection.commit();
    res
      .status(201)
      .json({ message: "Inssert to notification table is succsfully" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: err.message || err.sqlMessage });
    console.log("Error to insert notification", err);
  } finally {
    connection.release();
  }
};
