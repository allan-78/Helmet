const Brand = require('../../models/Brand');

// @desc    Get brands (admin)
// @route   GET /api/admin/brands
// @access  Private/Admin
exports.getBrands = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 25 } = req.query;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const brands = await Brand.find(query)
      .sort('name')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const count = await Brand.countDocuments(query);

    res.status(200).json({
      success: true,
      brands,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brands',
      error: error.message,
    });
  }
};

// @desc    Create brand
// @route   POST /api/admin/brands
// @access  Private/Admin
exports.createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create brand',
      error: error.message,
    });
  }
};

// @desc    Update brand
// @route   PUT /api/admin/brands/:id
// @access  Private/Admin
exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update brand',
      error: error.message,
    });
  }
};

// @desc    Delete brand
// @route   DELETE /api/admin/brands/:id
// @access  Private/Admin
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found',
      });
    }

    await brand.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete brand',
      error: error.message,
    });
  }
};

