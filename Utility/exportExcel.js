const ExcelJS = require("exceljs");

const exportExcel = async (res, data, typeReport, start, end, employee_id) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // ================== DATE RANGE ==================
  worksheet.mergeCells("A2:F2");
  worksheet.getCell("A2").value =
    `From: ${start || "All"}  To: ${end || "All"}`;
  worksheet.getCell("A2").alignment = { horizontal: "center" };

  //Helper format date (YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  //Define columns
  if (typeReport === "Income" || typeReport === "Unpaid") {
    worksheet.columns = [
      { header: "ID", key: "no", width: 10 },
      { header: "First Name", key: "first_name", width: 15 },
      { header: "Last Name", key: "last_name", width: 15 },
      { header: "Phone", key: "telephone", width: 15 },
      { header: "Amount", key: "amount", width: 12 },
      { header: "Transport Fee", key: "transport_fee", width: 15 },
      { header: "Pay Type", key: "pay_type", width: 12 },
      { header: "Transport Type", key: "transport_type", width: 15 },
      { header: "Start Date", key: "period_start", width: 15 },
      { header: "End Date", key: "period_end", width: 15 },
      { header: "Status", key: "pay_status", width: 12 },
      { header: "Total Income", key: "total_income", width: 18 },
    ];
  }

  if (typeReport === "Expenses") {
    worksheet.columns = [
      { header: "ID", key: "no", width: 10 },
      { header: "Category Name", key: "categories_name", width: 20 },
      { header: "Expenses Date", key: "expenses_date", width: 15 },
      { header: "Expenses Amount", key: "expenses_amount", width: 18 },
      { header: "Paid By", key: "paid_by", width: 15 },
      { header: "Description", key: "expenses_description", width: 25 },
    ];
  }
  if (typeReport === "Attendance") {
    worksheet.columns = [
      { header: "ID", key: "no", width: 10 },
      { header: "Last Name", key: "last_name", width: 20 },
      { header: "First Name", key: "first_name", width: 20 },
      { header: "Telephone", key: "telephone", width: 15 },
      { header: "Attendance Status", key: "attendance_status", width: 18 },
      { header: "Attendance Date", key: "attendance_date", width: 18 },
      { header: "Description", key: "description", width: 25 },
    ];
  }
  if (typeReport === "Score") {
    worksheet.columns = [
      { header: "ID", key: "no", width: 10 },
      { header: "Last Name", key: "last_name", width: 20 },
      { header: "First Name", key: "first_name", width: 20 },
      { header: "Attendance Point", key: "total_attendance_points", width: 15 },
      { header: "Question Point", key: "total_question_points", width: 15 },
      { header: "Subject Point", key: "subject_points", width: 15 },
      { header: "Total Point", key: "total_points", width: 15 },
      { header: "Ranking", key: "ranking", width: 15 },
      { header: "Description", key: "remark", width: 15 },
    ];
  }
  //Style header
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "007BFF" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  //Add rows
  let index = 1;
  console.log(data);
  data.forEach((item) => {
    worksheet.addRow({
      no: index++,
      ...item,
      period_start: formatDate(item.period_start),
      period_end: formatDate(item.period_end),
      expenses_date: formatDate(item.expenses_date),
    });
  });

  //Currency format (safe check) for income and unpaid
  if (typeReport === "Income" || typeReport === "Unpaid") {
    worksheet.getColumn("amount").numFmt = "$#,##0.00";
    worksheet.getColumn("transport_fee").numFmt = "$#,##0.00";
    worksheet.getColumn("total_income").numFmt = "$#,##0.00";
  }

  //Currency format (safe check) for expenses
  if (typeReport === "Expenses") {
    worksheet.getColumn("expenses_amount").numFmt = "$#,##0.00";
  }

  //Auto filter
  const lastColumn = worksheet.columns.length;

  worksheet.autoFilter = {
    from: "A1",
    to: `A1:${String.fromCharCode(64 + lastColumn)}1`,
  };

  //Freeze header row
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  //Dynamic filename
  const fileName = `report_${typeReport}_${Date.now()}.xlsx`;

  //Response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

  await workbook.xlsx.write(res);
  res.end();
};

module.exports = exportExcel;
