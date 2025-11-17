const Address = require('../../models/Address');

// @desc    Get all addresses for user
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get addresses',
      error: error.message,
    });
  }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
exports.addAddress = async (req, res) => {
  try {
    const { fullName, phoneNumber, address, city, postalCode, country, isDefault } = req.body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const newAddress = await Address.create({
      user: req.user._id,
      fullName,
      phoneNumber,
      address,
      city,
      postalCode,
      country,
      isDefault: isDefault || false,
    });

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      address: newAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: error.message,
    });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    const { fullName, phoneNumber, address, city, postalCode, country, isDefault } = req.body;

    let addressDoc = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (!addressDoc) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // If this is set as default, unset other defaults
    if (isDefault && !addressDoc.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    addressDoc.fullName = fullName || addressDoc.fullName;
    addressDoc.phoneNumber = phoneNumber || addressDoc.phoneNumber;
    addressDoc.address = address || addressDoc.address;
    addressDoc.city = city || addressDoc.city;
    addressDoc.postalCode = postalCode || addressDoc.postalCode;
    addressDoc.country = country || addressDoc.country;
    addressDoc.isDefault = isDefault !== undefined ? isDefault : addressDoc.isDefault;

    await addressDoc.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address: addressDoc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message,
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // If deleted address was default, set first remaining address as default
    if (address.isDefault) {
      const firstAddress = await Address.findOne({ user: req.user._id });
      if (firstAddress) {
        firstAddress.isDefault = true;
        await firstAddress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message,
    });
  }
};

// @desc    Set address as default
// @route   PATCH /api/addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Unset all other defaults
    await Address.updateMany({ user: req.user._id }, { isDefault: false });

    // Set this as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated',
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: error.message,
    });
  }
};
