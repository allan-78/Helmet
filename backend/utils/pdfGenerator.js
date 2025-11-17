const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate order receipt PDF
exports.generateOrderReceipt = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `receipt-${order._id}.pdf`;
      const filepath = path.join(__dirname, '../temp', filename);

      // Ensure temp directory exists
      if (!fs.existsSync(path.join(__dirname, '../temp'))) {
        fs.mkdirSync(path.join(__dirname, '../temp'));
      }

      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      doc
        .fontSize(25)
        .fillColor('#FF6B35')
        .text('🛡️ AegisGear', { align: 'center' });
      
      doc.moveDown();
      doc.fontSize(20).fillColor('#000').text('Order Receipt', { align: 'center' });
      doc.moveDown(2);

      // Order details
      doc.fontSize(12);
      doc.text(`Order ID: ${order._id}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.text(`Status: ${order.orderStatus}`);
      doc.moveDown();

      // Customer details
      doc.fontSize(14).text('Customer Information:', { underline: true });
      doc.fontSize(12);
      doc.text(`Name: ${order.shippingAddress.fullName}`);
      doc.text(`Email: ${order.user.email || 'N/A'}`);
      doc.text(`Phone: ${order.shippingAddress.phoneNumber}`);
      doc.moveDown();

      // Shipping address
      doc.fontSize(14).text('Shipping Address:', { underline: true });
      doc.fontSize(12);
      doc.text(order.shippingAddress.address);
      doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`);
      doc.text(order.shippingAddress.country);
      doc.moveDown(2);

      // Order items table
      doc.fontSize(14).text('Order Items:', { underline: true });
      doc.moveDown(0.5);

      order.orderItems.forEach((item, index) => {
        doc.fontSize(12);
        doc.text(`${index + 1}. ${item.name}`);
        doc.text(`   Quantity: ${item.quantity} x ₱${item.price.toFixed(2)}`);
        doc.text(`   Subtotal: ₱${(item.quantity * item.price).toFixed(2)}`);
        doc.moveDown(0.5);
      });

      doc.moveDown();

      // Pricing
      doc.fontSize(12);
      doc.text(`Items Price: ₱${order.itemsPrice.toFixed(2)}`, { align: 'right' });
      doc.text(`Shipping: ₱${order.shippingPrice.toFixed(2)}`, { align: 'right' });
      doc.text(`Tax: ₱${order.taxPrice.toFixed(2)}`, { align: 'right' });
      doc.moveDown(0.5);
      doc
        .fontSize(14)
        .fillColor('#FF6B35')
        .text(`Total: ₱${order.totalPrice.toFixed(2)}`, { align: 'right' });

      doc.moveDown(2);

      // Footer
      doc
        .fontSize(10)
        .fillColor('#666')
        .text('Thank you for shopping with AegisGear!', { align: 'center' });
      doc.text('For support, contact us at support@aegisgear.com', {
        align: 'center',
      });

      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};
