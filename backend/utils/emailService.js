const nodemailer = require('nodemailer');

const resolveEnv = (primary, fallback) => primary ?? fallback ?? '';

const createTransporter = () => {
  const host = resolveEnv(process.env.EMAIL_HOST, process.env.SMTP_HOST) || 'smtp.gmail.com';
  const port = Number(resolveEnv(process.env.EMAIL_PORT, process.env.SMTP_PORT) || 587);
  const user = resolveEnv(process.env.EMAIL_USER, process.env.SMTP_USER || process.env.GMAIL_USER);
  
  // --- THIS IS THE CORRECTED LINE ---
  // It now looks for EMAIL_PASS first to match your .env file
  const pass = resolveEnv(
    process.env.EMAIL_PASS, 
    process.env.EMAIL_PASSWORD || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
  );
  // --- END OF FIX ---

  const secure =
    process.env.EMAIL_SECURE !== undefined
      ? process.env.EMAIL_SECURE === 'true'
      : process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === 'true'
      : port === 465;

  if (!user || !pass) {
    console.warn('[emailService] Missing SMTP credentials. Check EMAIL_USER / EMAIL_PASS envs.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

const formatCurrency = (value) =>
  `₱${Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

const buildItemsTable = (order) =>
  order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
          <strong>${item.name}</strong><br/>
          <small>${item.size || 'Standard'} • ${item.color || '—'}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(
          item.price
        )}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(
          item.price * item.quantity
        )}</td>
      </tr>
    `
    )
    .join('');

const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: options.from || process.env.EMAIL_FROM || 'AegisGear <no-reply@aegisgear.com>',
    to: options.email || options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.attachments || [],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Email sent:', info.messageId);
  return info;
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B35, #FF8C42); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛡️ AegisGear</h1>
          <p>Password Reset Request</p>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <center>
            <a href="${resetUrl}" class="button">Reset Password</a>
          </center>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #FF6B35;">${resetUrl}</p>
          <p><strong>This link will expire in 10 minutes.</strong></p>
          <p>If you didn't request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 AegisGear. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request - AegisGear',
    html,
  });
};

const sendOrderConfirmationEmail = async (order, receiptPath) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF6B35;">Order Confirmation</h2>
      <p>Hi ${order.shippingAddress.fullName || order.user.name || 'Rider'},</p>
      <p>Thank you for your order! Here are the details:</p>
      <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
        <strong>Order ID:</strong> ${order._id}<br>
        <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
        <strong>Status:</strong> ${order.orderStatus}
      </div>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #FF6B35; color: white;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: center;">Quantity</th>
            <th style="padding: 10px; text-align: right;">Price</th>
            <th style="padding: 10px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${buildItemsTable(order)}
        </tbody>
      </table>
      <div style="text-align: right; margin: 20px 0;">
        <p><strong>Subtotal:</strong> ${formatCurrency(order.itemsPrice)}</p>
        <p><strong>Tax:</strong> ${formatCurrency(order.taxPrice)}</p>
        <p><strong>Shipping:</strong> ${formatCurrency(order.shippingPrice)}</p>
        <h3 style="color: #FF6B35;"><strong>Grand Total:</strong> ${formatCurrency(order.totalPrice)}</h3>
      </div>
      <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
        <strong>Shipping Address:</strong><br>
        ${order.shippingAddress.address}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
        ${order.shippingAddress.country}
      </div>
      <p>We'll send you another email when your order ships.</p>
      <p>Thank you for riding with AegisGear!</p>
    </div>
  `;

  const attachments = receiptPath
    ? [
        {
          filename: `receipt-${order._id}.pdf`,
          path: receiptPath,
        },
      ]
    : [];

  await sendEmail({
    email: order.user.email,
    subject: `Order Confirmation - #${order._id}`,
    html,
    attachments,
  });
};

const sendOrderStatusUpdateEmail = async (order, receiptPath) => {
  const statusMessages = {
    Processing: 'Your order is being processed.',
    Shipped: 'Your order has been shipped!',
    Delivered: 'Your order has been delivered.',
    Cancelled: 'Your order has been cancelled.',
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF6B35;">Order Status Update</h2>
      <p>Hi ${order.user.name || 'Rider'},</p>
      <p>${statusMessages[order.orderStatus] || 'Your order status has been updated.'}</p>
      <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
        <strong>Order ID:</strong> ${order._id}<br>
        <strong>Status:</strong> <span style="color: #FF6B35; font-weight: bold;">${order.orderStatus}</span><br>
        ${order.trackingNumber ? `<strong>Tracking Number:</strong> ${order.trackingNumber}<br>` : ''}
      </div>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #FF6B35; color: white;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: center;">Quantity</th>
            <th style="padding: 10px; text-align: right;">Price</th>
            <th style="padding: 10px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${buildItemsTable(order)}
        </tbody>
      </table>
      <div style="text-align: right; margin: 20px 0;">
        <p><strong>Subtotal:</strong> ${formatCurrency(order.itemsPrice)}</p>
        <p><strong>Tax:</strong> ${formatCurrency(order.taxPrice)}</p>
        <p><strong>Shipping:</strong> ${formatCurrency(order.shippingPrice)}</p>
        <h3 style="color: #FF6B35;"><strong>Grand Total:</strong> ${formatCurrency(order.totalPrice)}</h3>
      </div>
      <p>Please see the attached PDF receipt for complete details.</p>
      <p>Thank you for choosing AegisGear!</p>
    </div>
  `;

  const attachments = receiptPath
    ? [
        {
          filename: `receipt-${order._id}.pdf`,
          path: receiptPath,
        },
      ]
    : [];

  await sendEmail({
    email: order.user.email,
    subject: `Order Update - #${order._id}`,
    html,
    attachments,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};