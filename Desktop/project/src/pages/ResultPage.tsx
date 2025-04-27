import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, ArrowLeft, BarChart2 } from 'lucide-react';
import { useVerification } from '../contexts/VerificationContext';

const ResultPage = () => {
  const { currentVerification } = useVerification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentVerification) {
      navigate('/upload');
    }
  }, [currentVerification, navigate]);

  if (!currentVerification) {
    return null;
  }

  const isVerified = currentVerification.status === 'verified';

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <header className="bg-primary-dark py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-secondary" />
          <h1 className="text-white font-montserrat text-xl font-bold">Detachd</h1>
        </div>
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-white bg-primary-light px-3 py-1 rounded-md hover:bg-blue-700 transition font-opensans"
          >
            <span className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
          {isVerified && (
            <div className="absolute -top-12 right-0">
              <div className="bg-secondary text-white p-4 rounded-full shadow-lg">
                <Shield className="h-8 w-8" />
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="mb-4">
              {isVerified ? (
                <CheckCircle className="h-20 w-20 text-status-verified mx-auto" />
              ) : (
                <XCircle className="h-20 w-20 text-status-tampered mx-auto" />
              )}
            </div>
            
            <h2 className={`text-2xl font-bold font-montserrat ${isVerified ? 'text-status-verified' : 'text-status-tampered'}`}>
              {isVerified ? 'Image Verified' : 'Tampering Detected'}
            </h2>
            
            <p className="text-gray-600 mt-2 font-opensans">
              {isVerified 
                ? 'The image appears to be original and unmodified.' 
                : 'Our system detected potential manipulation in this image.'}
            </p>
          </div>

          <div className="border rounded-lg overflow-hidden mb-6">
            <img 
              src={currentVerification.imageUrl} 
              alt="Verified image" 
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-opensans">
              <span className="text-gray-600">Verification ID:</span>
              <span className="text-gray-900 font-medium">{currentVerification.id}</span>
            </div>
            
            <div className="flex justify-between text-sm font-opensans">
              <span className="text-gray-600">Date & Time:</span>
              <span className="text-gray-900 font-medium">
                {new Date(currentVerification.timestamp).toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between text-sm font-opensans">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${isVerified ? 'text-status-verified' : 'text-status-tampered'}`}>
                {isVerified ? 'Verified' : 'Tampered'}
              </span>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              onClick={() => navigate('/upload')}
              className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition font-opensans"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Verification
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-secondary hover:bg-secondary-light text-white font-medium py-2 px-4 rounded-md transition font-opensans"
            >
              View Dashboard
            </button>
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

export default ResultPage;