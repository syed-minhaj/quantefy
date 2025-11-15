import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { YearlyReportData } from "@/app/type";

export function generatePDF(report: YearlyReportData) {
    const doc = new jsPDF();
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(report.storeName, 14, 20);

    doc.setFontSize(16);
    doc.text(`Yearly Report ${report.year}`, 14, 30)

    // Store Overview
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Store Overview", 14, 45);

    autoTable(doc, {
        startY: 50,
        head: [["Metric", "Value"]],
        body: [
            ["Total Revenue", formatCurrency(report.storeOverview.revenue)],
            ["Total Cost", formatCurrency(report.storeOverview.cost)],
            ["Total Profit", formatCurrency(report.storeOverview.profit)],
            ["Total Orders", report.storeOverview.totalOrders.toString()],
        ],
        theme: "grid",
        headStyles: { fillColor: [38, 38, 38] },
    });

    // By Method
    const methodY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("By Order Method", 14, methodY);

    autoTable(doc, {
        startY: methodY + 5,
        head: [["Method", "Revenue", "Cost", "Profit", "Orders"]],
        body: [
            [
                "Manual",
                formatCurrency(report.byMethod.manual.revenue),
                formatCurrency(report.byMethod.manual.cost),
                formatCurrency(report.byMethod.manual.profit),
                report.byMethod.manual.orderCount.toString(),
            ],
            [
                "API",
                formatCurrency(report.byMethod.api.revenue),
                formatCurrency(report.byMethod.api.cost),
                formatCurrency(report.byMethod.api.profit),
                report.byMethod.api.orderCount.toString(),
            ],
        ],
        theme: "grid",
        headStyles: { fillColor: [38, 38, 38] },
    });

    // Top 5 Items
    const itemsY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Top 5 Items by Revenue", 14, itemsY);

    autoTable(doc, {
        startY: itemsY + 5,
        head: [["#", "Item Name", "Revenue", "Cost", "Profit", "Qty Sold"]],
        body: report.topItems.map((item, index) => [
            (index + 1).toString(),
            item.itemName,
            formatCurrency(item.revenue),
            formatCurrency(item.cost),
            formatCurrency(item.profit),
            item.quantitySold.toString(),
        ]),
        theme: "grid",
        headStyles: { fillColor: [38, 38, 38] },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        doc.internal.pageSize.getWidth() / 2,
        pageHeight - 10,
        { align: "center" }
    );

    return doc;
}
