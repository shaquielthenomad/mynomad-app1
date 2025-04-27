import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVerification, Verification } from '../contexts/VerificationContext';
import Header from '../components/Header';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { verificationHistory } = useVerification();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'recent' | 'stats'>('recent');

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate stats
  const totalVerifications = verificationHistory.length;
  const verifiedCount = verificationHistory.filter(v => v.status === 'verified').length;
  const tamperedCount = verificationHistory.filter(v => v.status === 'tampered').length;
  const verifiedPercentage = totalVerifications > 0 
    ? Math.round((verifiedCount / totalVerifications) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <Header />
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-primary p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white font-montserrat">
                  {currentUser?.role === 'insurer' ? 'Verification Dashboard' : 'My Verifications'}
                </h2>
                <button
                  onClick={() => navigate('/upload')}
                  className="bg-secondary hover:bg-secondary-light text-white px-4 py-2 rounded-md flex items-center font-opensans"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  New Verification
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex">
                <button
                  className={`px-6 py-3 font-opensans font-medium ${
                    activeTab === 'recent'
                      ? 'border-b-2 border-secondary text-secondary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('recent')}
                >
                  Recent Verifications
                </button>
                <button
                  className={`px-6 py-3 font-opensans font-medium ${
                    activeTab === 'stats'
                      ? 'border-b-2 border-secondary text-secondary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('stats')}
                >
                  Analytics
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'recent' && (
                <div>
                  {verificationHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-opensans">No verifications yet</p>
                      <button
                        onClick={() => navigate('/upload')}
                        className="mt-4 bg-secondary hover:bg-secondary-light text-white px-4 py-2 rounded-md text-sm font-opensans"
                      >
                        Verify Your First Image
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-opensans">
                              Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-opensans">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-opensans">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-opensans">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-opensans">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {verificationHistory.map((verification: Verification) => (
                            <tr key={verification.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <img 
                                  src={verification.imageUrl} 
                                  alt="Verification" 
                                  className="h-12 w-12 object-cover rounded"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-opensans">{verification.id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 font-opensans">
                                  {formatDate(verification.timestamp)}
                                </div>
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button 
                                  className="text-indigo-600 hover:text-indigo-900 font-opensans"
                                  onClick={() => navigate('/upload')}
                                >
                                  Verify New
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'stats' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Verifications */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="text-gray-500 text-sm font-opensans">Total Verifications</div>
                      <div className="mt-2 text-3xl font-bold text-primary font-montserrat">{totalVerifications}</div>
                    </div>

                    {/* Verified Rate */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="text-gray-500 text-sm font-opensans">Verified Rate</div>
                      <div className="mt-2 text-3xl font-bold text-status-verified font-montserrat">{verifiedPercentage}%</div>
                      <div className="mt-2 text-sm text-gray-500 font-opensans">{verifiedCount} verified</div>
                    </div>

                    {/* Tampered Rate */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="text-gray-500 text-sm font-opensans">Tampered Rate</div>
                      <div className="mt-2 text-3xl font-bold text-status-tampered font-montserrat">{100 - verifiedPercentage}%</div>
                      <div className="mt-2 text-sm text-gray-500 font-opensans">{tamperedCount} tampered</div>
                    </div>
                  </div>

                  {/* Visualization Placeholder */}
                  <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700 font-montserrat mb-4">Verification Trends</h3>
                    <div className="h-60 flex items-center justify-center">
                      {totalVerifications > 0 ? (
                        <div className="w-full">
                          <div className="h-32 flex items-end">
                            <div 
                              className="bg-status-verified rounded-t-md mr-2 w-16"
                              style={{ height: `${verifiedPercentage}%` }}
                            ></div>
                            <div 
                              className="bg-status-tampered rounded-t-md w-16"
                              style={{ height: `${100 - verifiedPercentage}%` }}
                            ></div>
                          </div>
                          <div className="flex text-sm text-gray-500 mt-2 font-opensans">
                            <div className="w-16 mr-2 text-center">Verified</div>
                            <div className="w-16 text-center">Tampered</div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 font-opensans">Not enough data to display trends</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark py-4 text-center">
        <p className="text-silver-light text-xs font-opensans">
          © 2025 Detachd. All rights reserved. POPIA compliant.
        </p>
      </footer>
    </div>
  );
};

export default DashboardPage;