const Product = require('../../models/Product');
const Review = require('../../models/Review');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../config/cloudinary');

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToCloudinary(file, 'aegisgear/products'));
      const results = await Promise.all(uploadPromises);
      
      productData.images = results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Product creation failed',
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      // Delete old images
      if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map(img => deleteFromCloudinary(img.publicId));
        await Promise.all(deletePromises);
      }

      // Upload new images
      const uploadPromises = req.files.map(file => uploadToCloudinary(file, 'aegisgear/products'));
      const results = await Promise.all(uploadPromises);
      
      req.body.images = results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Product update failed',
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(img => deleteFromCloudinary(img.publicId));
      await Promise.all(deletePromises);
    }

    // Delete associated reviews
    await Review.deleteMany({ product: product._id });

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Product deletion failed',
      error: error.message,
    });
  }
};

// @desc    Bulk delete products
// @route   POST /api/admin/products/bulk-delete
// @access  Private/Admin
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product IDs',
      });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    // Delete images from Cloudinary
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map(img => deleteFromCloudinary(img.publicId));
        await Promise.all(deletePromises);
      }
    }

    // Delete products and reviews
    await Product.deleteMany({ _id: { $in: productIds } });
    await Review.deleteMany({ product: { $in: productIds } });

    res.status(200).json({
      success: true,
      message: `${products.length} products deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Bulk delete failed',
      error: error.message,
    });
  }
};
