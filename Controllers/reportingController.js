const Reporting = require("../Models/reporting");
const exportExcel = require("../Utility/exportExcel");
const exportPDF = require("../Utility/exportPdf");

exports.getReportings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const typeReport = req.query.typeReport;
    console.log(typeReport);
    const employee_id = req.query.employee_id;
    const book_id = req.query.book_id;
    const start = req.query.start;
    const end = req.query.end;
    const data = await Reporting.getReporting(
      typeReport,
      limit,
      page,
      false,
      start,
      end,
      employee_id,
      book_id,
    );
    res.status(200).json(data);
  } catch (error) {
    console.log("Error request reporting", error);
    res.status(500).json({ message: error.message });
  }
};

exports.downloadExcel = async (req, res) => {
  try {
    const typeReport = req.query.typeReport;
    const start = req.query.start;
    const end = req.query.end;
    const employee_id = req.query.employee_id;
    const book_id = req.query.book_id;
    const data = await Reporting.getReporting(
      typeReport,
      1,
      100000,
      true,
      start,
      end,
      employee_id,
      book_id,
    );

    // ✅ ensure data is array
    if (!Array.isArray(data)) {
      console.error("Excel Data Error:", data);
      return res.status(500).json({ message: "Data format error" });
    }

    exportExcel(res, data, typeReport);
  } catch (error) {
    console.error("Export Excel Error:", error);
    res.status(500).json({ message: "Export Excel failed" });
  }
};

exports.downloadPDF = async (req, res) => {
  try {
    const typeReport = req.query.typeReport;
    const start = req.query.start;
    const end = req.query.end;
    const data = await Reporting.getReporting(
      typeReport,
      1,
      100000,
      true,
      start,
      end,
    );

    // ✅ ensure data is array
    if (!Array.isArray(data)) {
      console.error("PDF Data Error:", data);
      return res.status(500).json({ message: "Data format error" });
    }

    exportPDF(res, data, typeReport);
  } catch (error) {
    console.error("Export PDF Error:", error);
    res.status(500).json({ message: "Export PDF failed" });
  }
};
