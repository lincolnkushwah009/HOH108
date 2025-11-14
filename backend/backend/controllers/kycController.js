const User = require('../models/User');
const path = require('path');
const fs = require('fs').promises;

/**
 * @desc    Upload KYC documents for customer
 * @route   POST /api/kyc/upload
 * @access  Private (Customer)
 */
exports.uploadKYCDocuments = async (req, res) => {
  try {
    console.log('📤 KYC Upload Request:', {
      body: req.body,
      files: req.files ? Object.keys(req.files) : 'No files',
      user: req.user ? req.user._id : 'No user'
    });

    const { documentType, documentNumber } = req.body;

    if (!documentType || !documentNumber) {
      console.log('❌ Missing document type or number');
      return res.status(400).json({
        success: false,
        message: 'Document type and document number are required'
      });
    }

    if (!req.files || (!req.files.frontImage && !req.files.backImage)) {
      console.log('❌ No files uploaded');
      return res.status(400).json({
        success: false,
        message: 'At least one document image is required'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if document type already exists
    const existingDocIndex = user.kycDocuments.findIndex(
      doc => doc.documentType === documentType
    );

    const frontImagePath = req.files.frontImage
      ? `/uploads/kyc/${req.files.frontImage[0].filename}`
      : null;

    const backImagePath = req.files.backImage
      ? `/uploads/kyc/${req.files.backImage[0].filename}`
      : null;

    const documentData = {
      documentType,
      documentNumber,
      frontImage: frontImagePath,
      backImage: backImagePath,
      uploadedAt: new Date()
    };

    if (existingDocIndex !== -1) {
      // Update existing document
      user.kycDocuments[existingDocIndex] = documentData;
    } else {
      // Add new document
      user.kycDocuments.push(documentData);
    }

    // Update KYC status
    user.kycStatus = 'pending';
    user.kycSubmittedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'KYC documents uploaded successfully',
      data: user.kycDocuments
    });
  } catch (error) {
    console.error('Upload KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload KYC documents',
      error: error.message
    });
  }
};

/**
 * @desc    Get customer's KYC status and documents
 * @route   GET /api/kyc/status
 * @access  Private (Customer)
 */
exports.getKYCStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('kycStatus kycDocuments kycRejectionReason kycSubmittedAt kycVerifiedAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        kycStatus: user.kycStatus,
        kycDocuments: user.kycDocuments,
        kycRejectionReason: user.kycRejectionReason,
        kycSubmittedAt: user.kycSubmittedAt,
        kycVerifiedAt: user.kycVerifiedAt
      }
    });
  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC status',
      error: error.message
    });
  }
};

/**
 * @desc    Get all pending KYC verifications (Admin)
 * @route   GET /api/kyc/pending
 * @access  Private (Admin)
 */
exports.getPendingKYC = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      role: 'user',
      kycStatus: 'pending'
    }).select('fullName email phone customerId kycDocuments kycSubmittedAt').sort({ kycSubmittedAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    });
  } catch (error) {
    console.error('Get pending KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending KYC',
      error: error.message
    });
  }
};

/**
 * @desc    Get all KYC submissions with filters (Admin)
 * @route   GET /api/kyc/all
 * @access  Private (Admin)
 */
exports.getAllKYC = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = { role: 'user' };

    if (status && status !== 'all') {
      query.kycStatus = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('fullName email phone customerId kycStatus kycDocuments kycSubmittedAt kycVerifiedAt kycRejectionReason')
      .populate('kycDocuments.verifiedBy', 'fullName email')
      .sort({ kycSubmittedAt: -1 });

    const stats = await User.aggregate([
      { $match: { role: 'user' } },
      {
        $group: {
          _id: '$kycStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const statsObj = {
      not_submitted: 0,
      pending: 0,
      verified: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      statsObj[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      count: users.length,
      stats: statsObj,
      data: users
    });
  } catch (error) {
    console.error('Get all KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC submissions',
      error: error.message
    });
  }
};

/**
 * @desc    Verify customer KYC (Admin)
 * @route   PUT /api/kyc/verify/:userId
 * @access  Private (Admin)
 */
exports.verifyKYC = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.kycStatus === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'KYC already verified'
      });
    }

    // Update KYC status
    user.kycStatus = 'verified';
    user.kycVerifiedAt = new Date();
    user.kycRejectionReason = undefined;

    // Mark all documents as verified
    user.kycDocuments.forEach(doc => {
      doc.verifiedAt = new Date();
      doc.verifiedBy = req.user._id;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'KYC verified successfully',
      data: {
        customerId: user.customerId,
        fullName: user.fullName,
        kycStatus: user.kycStatus,
        kycVerifiedAt: user.kycVerifiedAt
      }
    });
  } catch (error) {
    console.error('Verify KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify KYC',
      error: error.message
    });
  }
};

/**
 * @desc    Reject customer KYC (Admin)
 * @route   PUT /api/kyc/reject/:userId
 * @access  Private (Admin)
 */
exports.rejectKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update KYC status
    user.kycStatus = 'rejected';
    user.kycRejectionReason = reason;
    user.kycVerifiedAt = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'KYC rejected',
      data: {
        customerId: user.customerId,
        fullName: user.fullName,
        kycStatus: user.kycStatus,
        kycRejectionReason: user.kycRejectionReason
      }
    });
  } catch (error) {
    console.error('Reject KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject KYC',
      error: error.message
    });
  }
};

/**
 * @desc    Get customer KYC details (Admin)
 * @route   GET /api/kyc/customer/:userId
 * @access  Private (Admin)
 */
exports.getCustomerKYC = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('fullName email phone customerId address kycStatus kycDocuments kycRejectionReason kycSubmittedAt kycVerifiedAt')
      .populate('kycDocuments.verifiedBy', 'fullName email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get customer KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer KYC',
      error: error.message
    });
  }
};

/**
 * @desc    Delete KYC document
 * @route   DELETE /api/kyc/document/:documentId
 * @access  Private (Customer)
 */
exports.deleteKYCDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const documentIndex = user.kycDocuments.findIndex(
      doc => doc._id.toString() === documentId
    );

    if (documentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete files from server (optional - implement based on your storage)
    const document = user.kycDocuments[documentIndex];
    // TODO: Delete actual files if stored locally

    // Remove document from array
    user.kycDocuments.splice(documentIndex, 1);

    // Update KYC status if no documents left
    if (user.kycDocuments.length === 0) {
      user.kycStatus = 'not_submitted';
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete KYC document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message
    });
  }
};
