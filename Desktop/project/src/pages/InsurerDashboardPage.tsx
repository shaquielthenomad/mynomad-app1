import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Download, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVerification, Verification } from '../contexts/VerificationContext';
import Header from '../components/Header';
import CertificateQRCode from '../components/CertificateQRCode';
import CertificatePDF from '../components/CertificatePDF';

const InsurerDashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const { verificationHistory, updateVerificationStatus, generateCertificate } = useVerification();
  const navigate = useNavigate();
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [notes, setNotes] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-status-verified" />;
      case 'tampered':
        return <XCircle className="h-5 w-5 text-status-tampered" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateVerificationStatus(id, status, notes);
    setSelectedVerification(null);
    setNotes('');
  };

  const handleCertificateGeneration = async (id: string) => {
    const certificateUrl = await generateCertificate(id);
    // In a real app, this would trigger a download
    window.open(certificateUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-primary p-6">
              <h2 className="text-2xl font-bold text-white font-montserrat">
                Insurer Dashboard
              </h2>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-opensans">
                        Policyholder
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-opensans">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-opensans">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-opensans">
                        Review Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-opensans">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {verificationHistory.map((verification) => (
                      <tr key={verification.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={verification.imageUrl} 
                              alt="" 
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 font-opensans">
                                John Doe
                              </div>
                              <div className="text-sm text-gray-500 font-opensans">
                                ID: {verification.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 font-opensans">
                            Personal
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(verification.status)}
                            <span className={`ml-2 text-sm font-medium font-opensans ${
                              verification.status === 'verified'
                                ? 'text-status-verified'
                                : verification.status === 'tampered'
                                ? 'text-status-tampered'
                                : 'text-gray-500'
                            }`}>
                              {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full font-opensans ${
                            verification.reviewStatus === 'reviewed'
                              ? 'bg-green-100 text-green-800'
                              : verification.reviewStatus === 'in_review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {verification.reviewStatus.replace('_', ' ').charAt(0).toUpperCase() + 
                             verification.reviewStatus.slice(1).replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex flex-col items-center space-y-2">
    <div className="flex space-x-2 mb-2">
      <button
        onClick={() => setSelectedVerification(verification)}
        className="text-indigo-600 hover:text-indigo-900"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleCertificateGeneration(verification.id)}
        className="text-green-600 hover:text-green-900"
      >
        <Download className="h-5 w-5" />
      </button>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-xs text-gray-500 mb-1">QR to Certificate</span>
      <CertificateQRCode certId={verification.id} />
      <CertificatePDF
        certId={verification.id}
        policyholderName={verification.policyholderName || 'John Doe'}
        reviewComments={verification.reviewComments || 'No comments left by insurer.'}
        verifiedAt={verification.verifiedAt || new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
      />
    </div>
  </div>
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 font-montserrat">
              Update Review Status
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-opensans">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedVerification(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-opensans"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedVerification.id, 'reviewed')}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-light font-opensans"
              >
                Mark as Reviewed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-primary-dark py-4 text-center">
        <p className="text-silver-light text-xs font-opensans">
          © 2025 Detachd. All rights reserved. POPIA compliant.
        </p>
      </footer>
    </div>
  );
};

export default InsurerDashboardPage;