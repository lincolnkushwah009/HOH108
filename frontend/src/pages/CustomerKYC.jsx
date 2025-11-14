import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS, API_URL } from '../config/api';
import ProfileLayout from '../components/ProfileLayout';

const CustomerKYC = () => {
  const [kycStatus, setKycStatus] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const [formData, setFormData] = useState({
    documentType: 'aadhar',
    documentNumber: '',
    frontImage: null,
    backImage: null
  });

  const documentTypes = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'voter_id', label: 'Voter ID' }
  ];

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.KYC_STATUS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setKycStatus(data.data.kycStatus);
        setDocuments(data.data.kycDocuments || []);
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.documentNumber) {
      alert('Please enter document number');
      return;
    }

    if (!formData.frontImage) {
      alert('Please upload at least the front image of the document');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const uploadData = new FormData();
      uploadData.append('documentType', formData.documentType);
      uploadData.append('documentNumber', formData.documentNumber);
      uploadData.append('frontImage', formData.frontImage);
      if (formData.backImage) {
        uploadData.append('backImage', formData.backImage);
      }

      const response = await fetch(API_ENDPOINTS.KYC_UPLOAD, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      const data = await response.json();

      if (data.success) {
        alert('KYC documents uploaded successfully!');
        setShowUploadForm(false);
        setFormData({
          documentType: 'aadhar',
          documentNumber: '',
          frontImage: null,
          backImage: null
        });
        fetchKYCStatus();
      } else {
        alert(data.message || 'Failed to upload documents');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload documents. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      not_submitted: { color: 'bg-gray-500', text: 'Not Submitted' },
      pending: { color: 'bg-yellow-500', text: 'Pending Verification' },
      verified: { color: 'bg-green-500', text: 'Verified' },
      rejected: { color: 'bg-red-500', text: 'Rejected' }
    };

    const badge = badges[status] || badges.not_submitted;

    return (
      <span className={`${badge.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading text-primary">KYC Verification</h1>
            <p className="text-gray-600 mt-1">Upload and manage your identity documents</p>
          </div>
          <div>
            {getStatusBadge(kycStatus)}
          </div>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-3">Verification Status</h2>
          <p className="text-white/90 mb-4">
            {kycStatus === 'not_submitted' && 'Please upload your identity documents to verify your account.'}
            {kycStatus === 'pending' && 'Your documents are under review. We will notify you once verification is complete.'}
            {kycStatus === 'verified' && 'Your account is verified! You can now access all features.'}
            {kycStatus === 'rejected' && 'Your documents were rejected. Please review the feedback and re-upload.'}
          </p>
          {(kycStatus === 'not_submitted' || kycStatus === 'rejected') && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Upload Documents
            </button>
          )}
        </motion.div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUploadForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading text-primary">Upload KYC Documents</h2>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  >
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Number *
                  </label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    placeholder="Enter document number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                {/* Front Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Front Image * (Max 5MB)
                  </label>
                  <input
                    type="file"
                    name="frontImage"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted: JPG, PNG, PDF</p>
                </div>

                {/* Back Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Back Image (Optional, Max 5MB)
                  </label>
                  <input
                    type="file"
                    name="backImage"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload if document has information on both sides</p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Documents'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Uploaded Documents */}
        {documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-heading text-primary mb-4">Uploaded Documents</h2>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {documentTypes.find(t => t.value === doc.documentType)?.label || doc.documentType}
                      </h3>
                      <p className="text-sm text-gray-600">Number: {doc.documentNumber}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {doc.verifiedAt && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {doc.frontImage && (
                      <a
                        href={`${API_URL}${doc.frontImage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline text-sm"
                      >
                        View Front Image →
                      </a>
                    )}
                    {doc.backImage && (
                      <a
                        href={`${API_URL}${doc.backImage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline text-sm"
                      >
                        View Back Image →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 rounded-2xl p-6"
        >
          <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Upload clear, readable images of your documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Ensure all corners of the document are visible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>File size should not exceed 5MB per image</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>Verification typically takes 1-2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>You will be notified via email once verification is complete</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </ProfileLayout>
  );
};

export default CustomerKYC;
