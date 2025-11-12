import { getSalesService } from "../../Services/Admin/salesService.js"
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

export const getSales = async (req, res) => {

    let { filter, startDate, endDate } = req.query

    try {

        let { allOrders, sales } = await getSalesService(filter, startDate, endDate)

        if (!sales || !allOrders) {
            return res.status(404).json({ success: false, message: "No Sales found !" })
        }

        res.status(200).json({ success: true, message: "Sales fetched successfully", allOrders, sales })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}

export const generateSalesPdf = async (req, res) => {
    try {
        const { filter, startDate, endDate } = req.query;

        const data = await getSalesService(filter, startDate, endDate);

        if (!data || !data.allOrders || data.allOrders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found for the selected filter.",
            });
        }

        const { allOrders, sales } = data;

        // 2️⃣ Create a new PDF document
        const doc = new PDFDocument({ margin: 40, size: "A4" });

        // 3️⃣ Setup response headers for file download
        const fileName = `Sales_Report_${filter}_${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`;
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Content-Type", "application/pdf");

        // Pipe PDF to response
        doc.pipe(res);

        // 4️⃣ Header / Title
        doc.fontSize(20).text("Sales Report", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Filter: ${filter.toUpperCase()}`);
        if (filter === "custom" && startDate && endDate) {
            doc.text(`Date Range: ${startDate} → ${endDate}`);
        }
        doc.text(`Generated On: ${new Date().toLocaleString()}`);
        doc.moveDown(1);

        // 5️⃣ Summary Section
        doc.fontSize(12).text("Summary", { underline: true });
        doc.moveDown(0.5);
        doc.text(`Total Orders: ${sales?.totalOrders || 0}`);
        doc.text(`Total Revenue: Rs ${sales?.totalRevenue || 0}`);
        doc.text(`Total Discount: Rs ${sales?.totalDiscount || 0}`);
        doc.text(`Total Pendings: ${sales?.totalPendings || 0}`);
        doc.moveDown(1.5);

        // 6️⃣ Table Header
        const startX = 40;
        let y = doc.y;
        const tableWidth = 500;
        const columnWidths = [25, 80, 80, 60, 60, 60, 60];

        doc.fontSize(10).font("Helvetica-Bold");
        const headers = [
            "#",
            "Order ID",
            "Buyer",
            "Products",
            "Date",
            "Coupon",
            "Net (₹)",
        ];

        headers.forEach((header, i) => {
            doc.text(header, startX + i * 70, y, { width: columnWidths[i] });
        });
        y += 20;
        doc.moveTo(startX, y - 5).lineTo(startX + tableWidth, y - 5).stroke();

        // 7️⃣ Table Rows
        doc.font("Helvetica").fontSize(9);
        allOrders.forEach((order, index) => {
            if (y > 750) {
                doc.addPage();
                y = 50;
            }

            const orderValues = [
                index + 1,
                order.orderId || "-",
                order.address?.fullname || "-",
                order.items?.length || 0,
                new Date(order.orderDate).toLocaleDateString(),
                order.couponId?.couponCode || "-",
                "Rs " + order.totalAmount.toFixed(2),
            ];

            orderValues.forEach((value, i) => {
                doc.text(value.toString(), startX + i * 70, y, {
                    width: columnWidths[i],
                });
            });

            y += 18;
        });

        doc.end();
    } catch (error) {
        console.error("Error generating PDF:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate PDF",
        });
    }
}


export const generateSalesExcel = async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;

    // 1️⃣ Fetch filtered sales data using existing service
    const data = await getSalesService(filter, startDate, endDate);
    if (!data || !data.allOrders.length) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    const { allOrders, sales } = data;

    // 2️⃣ Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    // 3️⃣ Add Title Row
    worksheet.mergeCells("A1:H1");
    worksheet.getCell("A1").value = "Sales Report";
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };

    // 4️⃣ Add Summary Section
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

    // 5️⃣ Add Table Header
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

    // 6️⃣ Add Order Data
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

    // 7️⃣ Auto-fit columns
    worksheet.columns.forEach((col) => {
      col.width = Math.max(12, col.header?.length || 12);
    });

    // 8️⃣ Send Excel file as response
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
    console.error("Error generating Excel:", error);
    res.status(500).json({ success: false, message: "Failed to generate Excel file" });
  }
};