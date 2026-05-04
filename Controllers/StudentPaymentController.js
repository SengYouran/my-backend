const StudentPayment = require("../Models/paymentStudent");
const db = require("../db");
exports.getStudentPayPaid = async (req, res) => {
  try {
    const type = req.query.type;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const data = await StudentPayment.getStudentPaymentPaid(type, page, limit);

    res.status(200).json(data);
  } catch (err) {
    console.log("GET STUDENT PAYMENT ERROR", err);
    res.status(500).json({ message: "Faild to fecth student payment" });
  }
};
exports.getStudentPaymentSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keywords = keyword.toLowerCase().trim();
    const DataStudentPayment = await StudentPayment.getStudentSearch(
      keywords,
      page,
      limit,
    );

    res.status(200).json(DataStudentPayment);
  } catch (err) {
    console.error(err);
  }
};
exports.filterStudentPaymentByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = `${startDate} 00:00:00`;
    const end = `${endDate} 23:59:59`;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    console;
    const dataStudentPaymentBydate =
      await StudentPayment.getStudentPaymentPaidByDate(start, end, page, limit);

    res.status(200).json(dataStudentPaymentBydate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getSearchStudentPaidUnpaidCTL = async (req, res) => {
  try {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keywords = keyword.toLowerCase().trim();
    const data = await StudentPayment.getSearchStudentPaidUnpaid(
      keywords,
      page,
      limit,
    );
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.insertStudentPayment = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const {
      student_id,
      amount,
      pay_type,
      period_start,
      period_end,
      pay_status,
      transport_type,
      transport_fee,
      is_active,
    } = req.body;
    await StudentPayment.insertStudent(connection, {
      student_id,
      amount,
      pay_type,
      period_start,
      period_end,
      pay_status,
      transport_type,
      transport_fee,
      is_active: is_active ?? 1,
    });
    await connection.commit();
    res.status(201).json({
      message: "Payment inserted successfully",
    }); //return successful to fornt
  } catch (err) {
    await connection.rollback();
    console.error("INSERT ERROR:", err);
    res.status(500).json({ message: err.sqlMessage || err.message });
  } finally {
    connection.release();
  }
};
exports.updatePayment = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const {
      student_id,
      amount,
      pay_type,
      period_start,
      period_end,
      pay_status,
      transport_type,
      transport_fee,
      is_active,
    } = req.body;
    await StudentPayment.updatePaymentStudentModel(connection, id, {
      student_id,
      amount,
      pay_type,
      period_start,
      period_end,
      pay_status,
      transport_type,
      transport_fee,
      is_active,
    });
    await connection.commit();
    res.json({ message: "Update successful ✅" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({
      message: err.message || "Update transaction failed ❌",
    });
  } finally {
    connection.release();
  }
};
