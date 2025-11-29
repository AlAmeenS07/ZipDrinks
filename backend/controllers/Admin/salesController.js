import { getSalesService } from "../../Services/Admin/salesService.js"
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { FAILED_TO_GENERATE_PDF, NOT_FOUND, ORDERS_NOT_FOUND, SALES_FETCHED_SUCCESSFULLY, SALES_NOT_FOUND, SERVER_ERROR, SUCCESS } from "../../utils/constants.js";

// get sales report

export const getSales = async (req, res) => {

  let { filter, startDate, endDate } = req.query

  try {

    let { allOrders, sales } = await getSalesService(filter, startDate, endDate)

    if (!sales || !allOrders) {
      return res.status(NOT_FOUND).json({ success: false, message: SALES_NOT_FOUND })
    }

    res.status(SUCCESS).json({ success: true, message: SALES_FETCHED_SUCCESSFULLY, allOrders, sales })

  } catch (error) {
    res.status(SERVER_ERROR).json({ success: false, message: error.message })
  }

}

// sales pdf

export const generateSalesPdf = async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;
    const data = await getSalesService(filter, startDate, endDate);

    if (!data || !data.allOrders || data.allOrders.length === 0) {
      return res.status(NOT_FOUND).json({ success: false, message: ORDERS_NOT_FOUND });
    }

    const { allOrders, sales } = data;

    const doc = new PDFDocument({ margin: 40, size: "A4", bufferPages: true });

    const fileName = `Sales_Report_${filter}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);


    // HEADER SECTION (Branding)

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Sales Report", { align: "center" });

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Filter: ${filter.toUpperCase()}`, { align: "center" });

    if (filter === "custom") {
      doc.text(`Date Range: ${startDate} to ${endDate}`, { align: "center" });
    }

    doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" });

    doc.moveDown(1.5);

    // SUMMARY SECTION (Clean Box)

    doc.rect(40, doc.y, 515, 90).stroke("#D1D1D1");

    let summaryY = doc.y + 10;

    doc.fontSize(12).font("Helvetica-Bold").text("Summary", 50, summaryY);
    summaryY += 20;

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Total Orders: ${sales.totalOrders}`, 50, summaryY);
    doc.text(`Total Revenue: Rs ${sales.totalRevenue}`, 200, summaryY);
    doc.text(`Total Discount: Rs ${sales.totalDiscount}`, 350, summaryY);
    summaryY += 20;

    doc.text(`Pending Orders: ${sales.totalPendings}`, 50, summaryY);

    doc.moveDown(4);

    // TABLE HEADER

    const tableX = 40;
    let tableY = doc.y;

    const headers = ["#", "Order ID", "Customer", "Items", "Date", "Coupon", "Net (₹)"];
    const widths = [30, 90, 100, 50, 70, 80, 80];

    // Header background
    doc.rect(tableX, tableY, 515, 22).fill("#F1F1F1").stroke();
    doc.fillColor("black");

    let x = tableX;

    doc.font("Helvetica-Bold").fontSize(10);
    headers.forEach((h, i) => {
      doc.text(h, x + 5, tableY + 6, { width: widths[i], align: "left" });
      x += widths[i];
    });

    tableY += 32;

    // TABLE ROWS

    doc.font("Helvetica").fontSize(9);

    allOrders.forEach((order, index) => {
      // Page break logic
      if (tableY > 750) {
        doc.addPage();
        tableY = 50;
      }

      const isEven = index % 2 === 0;
      if (isEven) {
        doc.rect(tableX, tableY+28, 515, 20).fill("#FAFAFA");
        doc.fillColor("black");
      }

      let xx = tableX;

      const rowValues = [
        index + 1,
        order.orderId,
        order.address?.fullname || "-",
        order.items?.length || 0,
        new Date(order.orderDate).toLocaleDateString(),
        order.couponId?.couponCode || "-",
        "Rs " + order.totalAmount.toFixed(2),
      ];

      rowValues.forEach((val, i) => {
        doc.text(val.toString(), xx + 5, tableY + 6, {
          width: widths[i],
        });
        xx += widths[i];
      });

      tableY += 20;
    });

    // FOOTER 

    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(9)
        .text(
          `Page ${i + 1} of ${range.count}`,
          0,
          820,
          { align: "center" }
        );
    }

    doc.end();
  } catch (error) {
    console.log(error);
    return res.status(SERVER_ERROR).json({success: false, message: FAILED_TO_GENERATE_PDF });
  }
};



// sales excel

export const generateSalesExcel = async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;

    //  Fetch sales data 
    const data = await getSalesService(filter, startDate, endDate);
    if (!data || !data.allOrders.length) {
      return res.status(NOT_FOUND).json({ success: false, message: ORDERS_NOT_FOUND });
    }

    const { allOrders, sales } = data;

    //  Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    //  Add Title Row
    worksheet.mergeCells("A1:H1");
    worksheet.getCell("A1").value = "Sales Report";
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };

    //  Add Summary Section
    worksheet.addRow([]);
    worksheet.addRow(["Filter Type", filter.toUpperCase()]);
    if (filter === "custom" && startDate && endDate) {
      worksheet.addRow(["Date Range", `${startDate} → ${endDate}`]);
    }
    worksheet.addRow(["Total Orders", sales?.totalOrders || 0]);
    worksheet.addRow(["Total Revenue", sales?.totalRevenue || 0]);
    worksheet.addRow(["Total Discount", sales?.totalDiscount || 0]);
    worksheet.addRow(["Total Pendings", sales?.totalPendings || 0]);
    worksheet.addRow([]);

    //  Add Table Header
    worksheet.addRow([
      "#",
      "Order ID",
      "Buyer",
      "Products",
      "Date",
      "Coupon Code",
      "Discount (₹)",
      "Net Amount (₹)",
    ]);

    worksheet.getRow(worksheet.lastRow.number).font = { bold: true };

    //  Add Order Data
    allOrders.forEach((order, index) => {
      worksheet.addRow([
        index + 1,
        order.orderId || "-",
        order.address?.fullname || "-",
        order.items?.length || 0,
        new Date(order.orderDate).toLocaleDateString(),
        order.couponId?.couponCode || "-",
        order.couponAmount || 0,
        order.totalAmount || 0,
      ]);
    });

    //  Auto-fit columns
    worksheet.columns.forEach((col) => {
      col.width = Math.max(12, col.header?.length || 12);
    });

    //  Send Excel file as response
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Sales_Report_${filter}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};