import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async generateInvoicePdf(invoiceId: string): Promise<Buffer> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { items: true },
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

      // Create PDF content
      doc.fontSize(20).text('Invoice', { align: 'center' });
      doc.text(`Invoice ID: ${invoice.id}`);
      doc.text(`Customer ID: ${invoice.customerId}`);
      doc.text(`Total Amount: ${invoice.total_amount}`);
      doc.text(`Due Date: ${invoice.due_date.toISOString()}`);
      doc.text(`Status: ${invoice.status}`);

      doc.moveDown().fontSize(16).text('Items');
      invoice.items.forEach((item) => {
        doc.text(`Item ID: ${item.itemId}`);
        doc.text(`Quantity: ${item.quantity}`);
        doc.text(`Unit Price: ${item.unit_price}`);
        doc.text(`Total: ${item.total}`);
        doc.moveDown();
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

    // Add rows
    invoices.forEach((invoice) => {
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

    // Create a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }

  // generate excel invoice report for a custromer
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

    // Add rows
    invoices.forEach((invoice) => {
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

    // Create a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }
}
