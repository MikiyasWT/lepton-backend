import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma.service';
import * as ExcelJS from 'exceljs';
import * as path from 'path';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async generateInvoicePdf(invoiceId: string): Promise<Buffer> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        items: true,
        customer: true, // Ensure customer information is included
      },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      // Capture PDF output in a buffer
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header with logo and company information
      const logoPath = path.join(
        process.cwd(),
        '../backend/src/assets/images/lepton.png',
      );

      doc.fontSize(12).fillColor('black');

      doc
        .image(logoPath, 450, 20, { width: 100 })
        .text('Hermanos Technologies', 50, 20)
        .moveDown(0.5)
        .text('Mikiyas Wendmneh', 50, 35)
        .moveDown(0.5)
        .text(
          'Fullstack Developer .NET | NestJs | React | TypeScript | Remote',
          50,
          50,
        )
        .moveDown(0.5)
        .text('mikiywendu44@gmail.com', 50, 65)
        .moveDown(0.5)
        .text('Phone: +251915536448', 50, 80)
        .moveDown(0.5)
        .text('Github: github.com/mikiyaswt', 50, 95)
        .moveDown(0.5)
        .text('Fiverr: https://www.fiverr.com/s/NNogzwQ', 50, 110);

      // Line break with margin
      const linePosition1 = 140;
      doc.moveTo(50, linePosition1).lineTo(550, linePosition1).stroke();

      // "Provided by" section
      const providedByPosition = linePosition1 + 20;
      doc
        .fontSize(14)
        .text('Provided by:', 50, providedByPosition)
        .fontSize(12)
        .text('Mikiyas Wendmneh', 50, providedByPosition + 15)
        .moveDown(0.5)
        .text(
          `Date of Service: ${new Date().toISOString().split('T')[0]}`,
          50,
          providedByPosition + 30,
        );

      // Line break with margin
      const linePosition2 = providedByPosition + 50;
      doc.moveTo(50, linePosition2).lineTo(550, linePosition2).stroke();

      doc.moveDown(2); // Increased margin

      // Table for items
      const tableTop = doc.y + 10; // Position of the items table
      const tableHeaders = [
        'Description',
        'Quantity',
        'Unit Price',
        'Total ETB',
      ];
      const columnWidths = [280, 100, 100, 100]; // Adjusted column widths
      const startXTable = 50; // Starting X position for the items table
      const rowHeightTable = 30; // Height of each row
      const headerYOffsetTable = 10; // Offset for the header to avoid overlap

      // Draw table headers with styles
      let xPositionTable = startXTable;
      tableHeaders.forEach((header, i) => {
        doc
          .fontSize(12)
          .fillColor('black') // Ensure text color is set
          .text(header, xPositionTable, tableTop - headerYOffsetTable, {
            width: columnWidths[i],
            align: 'left', // Align text to the left
          });
        xPositionTable += columnWidths[i];
      });

      // Draw table rows with styles
      invoice.items.forEach((item, index) => {
        const yPositionTable =
          tableTop + rowHeightTable + index * rowHeightTable;
        xPositionTable = startXTable;
        doc
          .fontSize(12) // Ensure font size for items is set
          .fillColor('black') // Ensure text color is set
          .text(item.description, xPositionTable, yPositionTable, {
            width: columnWidths[0],
            align: 'left',
          });
        xPositionTable += columnWidths[0];
        doc.text(item.quantity.toString(), xPositionTable, yPositionTable, {
          width: columnWidths[1],
          align: 'left',
        });
        xPositionTable += columnWidths[1];
        doc.text(item.unit_price.toString(), xPositionTable, yPositionTable, {
          width: columnWidths[2],
          align: 'left',
        });
        xPositionTable += columnWidths[2];
        doc.text(
          item.total.toNumber().toFixed(2),
          xPositionTable,
          yPositionTable,
          {
            width: columnWidths[3],
            align: 'left',
          },
        );
      });

      // Calculate total amount
      const totalAmount = invoice.items.reduce(
        (sum, item) => sum + item.total.toNumber(), // Convert Decimal to number
        0,
      );

      // Draw horizontal line before totals
      doc.moveDown(2);
      const linePosition3 = doc.y;
      doc.moveTo(50, linePosition3).lineTo(550, linePosition3).stroke();

      // Draw "Total" row
      doc.fontSize(12).fillColor('black');
      doc.text('Total:', startXTable, linePosition3 + 10, {
        width: columnWidths[0],
        align: 'left',
      });
      doc.text(
        totalAmount.toFixed(2),
        startXTable + columnWidths[0],
        linePosition3 + 10,
        {
          width: columnWidths[3],
          align: 'left',
        },
      );

      // Draw "Status" row
      const status = invoice.status === 'Pending' ? 'Unpaid' : 'Paid';
      doc.text('Status:', startXTable, linePosition3 + 30, {
        width: columnWidths[0],
        align: 'left',
      });
      doc.text(status, startXTable + columnWidths[0], linePosition3 + 30, {
        width: columnWidths[3],
        align: 'left',
      });

      doc.moveDown(2); // Space between sections

      // Draw a horizontal line before adding "Hello again" text
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      // Add "Hello again" text
      const invoiceDetail = doc.y + 10; // Position for "Hello again"
      doc
        .fontSize(16)
        .fillColor('black') // Ensure text color is set
        .text('Invoice Detail', 50, invoiceDetail);

      doc.moveDown(2); // Space between sections

      // Invoice details
      const detailsTop = doc.y;
      const invoiceDetails = [
        { label: 'Invoice ID:', value: invoice.id },
        { label: 'Customer ID:', value: invoice.customerId },
        { label: 'Customer Name:', value: invoice.customer.name }, // Add customer name
        { label: 'Total Amount:', value: invoice.total_amount },
        { label: 'Due Date:', value: invoice.due_date.toISOString() },
        { label: 'Status:', value: invoice.status },
      ];

      const detailLabelWidth = 150; // Width for label
      const detailValueWidth = 250; // Width for value
      const detailStartX = 50; // Starting X position for details
      const detailRowHeight = 20; // Height of each row for details

      invoiceDetails.forEach((detail, index) => {
        const yPosition = detailsTop + index * detailRowHeight;
        doc
          .fontSize(12)
          .fillColor('black') // Ensure text color is set
          .text(detail.label, detailStartX, yPosition, {
            width: detailLabelWidth,
            align: 'left',
          });
        doc.text(
          detail.value.toString(),
          detailStartX + detailLabelWidth,
          yPosition,
          {
            width: detailValueWidth,
            align: 'left',
          },
        );
      });

      doc.end();
    });
  }

  // export all invoice to excel only for admin
  async generateInvoicesExcel(): Promise<Buffer> {
    // Fetch invoices with their associated items
    const invoices = await this.prisma.invoice.findMany({
      include: { items: true },
    });

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoices');

    // Define columns
    worksheet.columns = [
      { header: 'Invoice ID', key: 'invoiceId', width: 20 },
      { header: 'Customer ID', key: 'customerId', width: 20 },
      { header: 'Total Amount', key: 'totalAmount', width: 15 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Item ID', key: 'itemId', width: 20 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Unit Price', key: 'unitPrice', width: 15 },
      { header: 'Total', key: 'total', width: 15 },
    ];

    let outstandingBalance = 0;
    let totalPaid = 0;

    // Add rows
    invoices.forEach((invoice) => {
      if (invoice.status === 'Pending') {
        outstandingBalance += parseFloat(invoice.total_amount.toString());
      } else if (invoice.status === 'Paid') {
        totalPaid += parseFloat(invoice.total_amount.toString());
      }

      invoice.items.forEach((item) => {
        worksheet.addRow({
          invoiceId: invoice.id,
          customerId: invoice.customerId,
          totalAmount: invoice.total_amount,
          dueDate: invoice.due_date.toISOString().split('T')[0], // Format date
          status: invoice.status,
          itemId: item.itemId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          total: item.total,
        });
      });
    });

    // Add rows for outstanding balance and total paid
    worksheet.addRow({});
    worksheet.addRow({
      invoiceId: 'Outstanding Balance',
      totalAmount: outstandingBalance,
    });
    worksheet.addRow({ invoiceId: 'Total Paid', totalAmount: totalPaid });

    // Create a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }

  // export all customer's invoices for customer
  async generateCustomersInvoicesExcel(customerId: string): Promise<Buffer> {
    // Fetch invoices with their associated items for the specified customer
    const invoices = await this.prisma.invoice.findMany({
      where: { customerId },
      include: { items: true },
    });

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoices');

    // Define columns
    worksheet.columns = [
      { header: 'Invoice ID', key: 'invoiceId', width: 20 },
      { header: 'Customer ID', key: 'customerId', width: 20 },
      { header: 'Total Amount', key: 'totalAmount', width: 15 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Item ID', key: 'itemId', width: 20 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Unit Price', key: 'unitPrice', width: 15 },
      { header: 'Total', key: 'total', width: 15 },
    ];

    let outstandingBalance = 0;
    let totalPaid = 0;

    // Add rows
    invoices.forEach((invoice) => {
      if (invoice.status === 'Pending') {
        outstandingBalance += parseFloat(invoice.total_amount.toString());
      } else if (invoice.status === 'Paid') {
        totalPaid += parseFloat(invoice.total_amount.toString());
      }

      invoice.items.forEach((item) => {
        worksheet.addRow({
          invoiceId: invoice.id,
          customerId: invoice.customerId,
          totalAmount: invoice.total_amount,
          dueDate: invoice.due_date.toISOString().split('T')[0], // Format date
          status: invoice.status,
          itemId: item.itemId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          total: item.total,
        });
      });
    });

    // Add rows for outstanding balance and total paid
    worksheet.addRow({});
    worksheet.addRow({
      invoiceId: 'Outstanding Balance',
      totalAmount: outstandingBalance,
    });
    worksheet.addRow({ invoiceId: 'Total Paid', totalAmount: totalPaid });

    // Create a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }
}
