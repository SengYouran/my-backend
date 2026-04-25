const PDFDocument = require("pdfkit");

const exportPDF = (res, data, type, start, end) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

  doc.pipe(res);

  doc.fontSize(16).text("School Financial Report");

  doc.moveDown();

  data.forEach((item) => {
    doc
      .fontSize(10)
      .text(
        `${item.first_name} ${item.last_name} | $${item.amount} | ${item.pay_status}`,
      );
  });

  doc.end();
};

module.exports = exportPDF;
