import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Shield, X } from 'lucide-react';
import { useVerification } from '../contexts/VerificationContext';
import { useAuth } from '../contexts/AuthContext';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { uploadImage } = useVerification();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.match('image.*') && selectedFile.size < 10 * 1024 * 1024) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        alert('Please select an image file (JPG, PNG) less than 10MB');
      }
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.match('image.*') && droppedFile.size < 10 * 1024 * 1024) {
        setFile(droppedFile);
        setPreview(URL.createObjectURL(droppedFile));
      } else {
        alert('Please select an image file (JPG, PNG) less than 10MB');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file && consent) {
      await uploadImage(file, consent);
      navigate('/verification');
    }
  };

  const resetFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <header className="bg-primary-dark py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-secondary" />
          <h1 className="text-white font-montserrat text-xl font-bold">Detachd</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-silver-light text-sm font-opensans hidden sm:inline-block">
            {currentUser?.email}
          </span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-white text-sm bg-primary-light px-3 py-1 rounded-md hover:bg-blue-700 transition font-opensans"
          >
            Dashboard
          </button>
          <button 
            onClick={logout}
            className="text-white text-sm border border-silver px-3 py-1 rounded-md hover:bg-primary-light transition font-opensans"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          <h2 className="text-2xl font-semibold text-primary mb-6 font-montserrat text-center">
            Upload Image for Verification
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive ? 'border-secondary bg-secondary bg-opacity-10' : 'border-gray-300 hover:border-secondary'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
                className="hidden"
              />

              {preview ? (
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-60 mx-auto rounded-md object-contain" 
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetFile();
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600 font-opensans">
                    Drag & drop an image here, or click to browse
                  </p>
                  <p className="text-sm text-gray-400 font-opensans">
                    Supports: JPG, PNG (max 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="h-4 w-4 text-secondary border-gray-300 rounded"
                  required
                />
              </div>
              <label htmlFor="consent" className="ml-3 text-sm text-gray-600 font-opensans">
                I consent to data processing as per POPIA regulations. My data will be used for verification purposes only and stored securely.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || !consent}
              className="w-full bg-secondary hover:bg-secondary-light disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-md transition font-opensans"
            >
              Upload & Verify
            </button>
          </form>
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

export default UploadPage;