const Order = require('../../models/Order');
const { generateOrderReceipt } = require('../../utils/pdfGenerator');
const { sendEmail } = require('../../utils/emailService');
const fs = require('fs');

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: Date.now(),
      note,
    });

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    // Send email notification
    try {
      await sendEmail({
        email: order.user.email,
        subject: `Order ${status} - AegisGear`,
        html: `
          <h2>Order Status Updated</h2>
          <p>Hi ${order.user.name},</p>
          <p>Your order #${order._id} status has been updated to: <strong>${status}</strong></p>
          ${note ? `<p>Note: ${note}</p>` : ''}
          <p>Thank you for shopping with AegisGear!</p>
        `,
      });
    } catch (emailError) {
      console.error('Email send failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Status update failed',
      error: error.message,
    });
  }
};

// @desc    Update payment status
// @route   PATCH /api/admin/orders/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === 'Paid') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment status update failed',
      error: error.message,
    });
  }
};

// @desc    Resend order email with PDF
// @route   POST /api/admin/orders/:id/resend-email
// @access  Private/Admin
exports.resendOrderEmail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Generate PDF
    const pdfPath = await generateOrderReceipt(order);

    // Send email with PDF attachment
    await sendEmail({
      email: order.user.email,
      subject: `Order Receipt - AegisGear #${order._id}`,
      html: `
        <h2>Order Receipt</h2>
        <p>Hi ${order.user.name},</p>
        <p>Please find your order receipt attached.</p>
        <p>Order ID: ${order._id}</p>
        <p>Total: ₱${order.totalPrice.toFixed(2)}</p>
        <p>Thank you for shopping with AegisGear!</p>
      `,
      attachments: [
        {
          filename: `receipt-${order._id}.pdf`,
          path: pdfPath,
        },
      ],
    });

    // Delete temp PDF file
    fs.unlinkSync(pdfPath);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email send failed',
      error: error.message,
    });
  }
};
