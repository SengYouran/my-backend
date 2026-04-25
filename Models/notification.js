const db = require("../db");
const paginate = require("../Utility/paginate");
const Notification = {
  getReceiver: async (page, limit) => {
    const dataQuery = `
        SELECT id, last_name,first_name FROM employee_tbl
        `;
    const countQuery = `
    SELECT COUNT(*) AS total_receiver
    FROM employee_tbl
    `;
    const paginateData = await paginate({
      db,
      dataQuery,
      countQuery,
      page,
      limit,
      params: [],
    });
    return {
      results: paginateData.results,
      pagination: paginateData.pagination,
    };
  },
  getNotification: async (receiverId) => {
    const sqlNotification = `
    SELECT notification_id, sender_id, title, descriptions, is_read
    FROM notification_tbl
    WHERE receiver_id = ? AND is_read = 0
    ORDER BY createdAt DESC;
  `;

    const sqlCount = `
    SELECT COUNT(*) AS total_notification
    FROM notification_tbl
    WHERE receiver_id = ? AND is_read = 0;
  `;

    const [notifications] = await db.query(sqlNotification, [receiverId]);
    const [countResult] = await db.query(sqlCount, [receiverId]);

    return {
      notifications,
      total: countResult[0].total_notification,
    };
  },
  markreadMessageNotification: async (notification_id) => {
    const sqlMarkRead = `
    UPDATE notification_tbl SET is_read = 1 WHERE notification_id = ?
    `;
    return await db.query(sqlMarkRead, [notification_id]);
  },
  insertNotificationModel: async (conn, data) => {
    const sqlInsert = `
    INSERT INTO notification_tbl (sender_id, receiver_id, title, descriptions) 
    VALUES (?,?,?,?)
    `;
    const values = [
      data.sender_id,
      data.receiver_id,
      data.title,
      data.descriptions,
    ];

    console.log(
      data.sender_id,
      data.receiver_id,
      data.title,
      data.descriptions,
    );
    const [results] = await conn.query(sqlInsert, values);
    return {
      notification_id: results.insertId,
      ...results,
    };
  },
};
module.exports = Notification;
