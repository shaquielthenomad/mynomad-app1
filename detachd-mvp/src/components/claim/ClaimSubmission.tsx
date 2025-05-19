import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMsal } from '@azure/msal-react';
import { Claim, VerificationResult } from '../../lib/types';
import { validateImage, generateBlockchainHash } from '../../lib/utils';

interface ClaimFormData {
  verificationCode: string;
  type: 'accident' | 'medical' | 'property' | 'other';
  description: string;
  incidentDate: string;
  documents: File[];
}

export default function ClaimSubmission() {
  const router = useRouter();
  const { accounts } = useMsal();
  const [formData, setFormData] = useState<ClaimFormData>({
    verificationCode: '',
    type: 'accident',
    description: '',
    incidentDate: '',
    documents: [],
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{
    policyFound: boolean;
    policyNumber?: string;
    policyholderName?: string;
  }>({ policyFound: false });

  const handleVerificationCodeCheck = async () => {
    if (!formData.verificationCode) {
      setError('Please enter a verification code');
      return;
    }

    try {
      const response = await fetch(`/api/policies/verify/${formData.verificationCode}`);
      const data = await response.json();

      if (response.ok) {
        setVerificationStatus({
          policyFound: true,
          policyNumber: data.policyNumber,
          policyholderName: data.policyholderName,
        });
        setError('');
      } else {
        setError('Invalid verification code');
        setVerificationStatus({ policyFound: false });
      }
    } catch (err) {
      setError('Failed to verify code');
      setVerificationStatus({ policyFound: false });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validation = validateImage(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return false;
      }
      return true;
    });

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...validFiles],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationStatus.policyFound) {
      setError('Please verify your policy code first');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Upload documents first
      const documentUrls = await Promise.all(
        formData.documents.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          return data.url;
        })
      );

      // Create claim
      const newClaim: Partial<Claim> = {
        type: formData.type,
        description: formData.description,
        incidentDate: new Date(formData.incidentDate),
        submissionDate: new Date(),
        status: 'pending',
        documents: documentUrls.map(url => ({
          type: 'image',
          url,
          verificationStatus: 'pending',
          verificationConfidence: 0,
        })),
        verificationCode: formData.verificationCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClaim),
      });

      if (response.ok) {
        const { claimId } = await response.json();
        
        // Start verification process
        const verificationPromises = documentUrls.map(async (url) => {
          const verificationResponse = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: url, claimId }),
          });
          return verificationResponse.json();
        });

        const verificationResults: VerificationResult[] = await Promise.all(verificationPromises);
        
        // Add to blockchain
        const blockchainHash = generateBlockchainHash(JSON.stringify({
          claimId,
          verificationResults,
          timestamp: new Date().toISOString(),
        }));

        await fetch(`/api/claims/${claimId}/blockchain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blockchainHash }),
        });

        router.push(`/claim/status/${claimId}`);
      } else {
        throw new Error('Failed to create claim');
      }
    } catch (err) {
      setError('Failed to submit claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl mb-6">Submit Claim</h2>

      <div className="mb-8">
        <label className="block mb-2">Verification Code</label>
        <div className="flex gap-4">
          <input
            type="text"
            value={formData.verificationCode}
            onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value.toUpperCase() })}
            className="flex-1 p-2 border rounded"
            placeholder="Enter 6-character code"
            maxLength={6}
          />
          <button
            onClick={handleVerificationCodeCheck}
            className="bg-[#003366] text-white px-4 py-2 rounded hover:bg-[#002244]"
          >
            Verify
          </button>
        </div>
        {verificationStatus.policyFound && (
          <div className="mt-2 p-4 bg-green-50 text-green-700 rounded">
            <p>Policy Found: {verificationStatus.policyNumber}</p>
            <p>Policyholder: {verificationStatus.policyholderName}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Claim Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="accident">Accident</option>
            <option value="medical">Medical</option>
            <option value="property">Property</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Incident Date</label>
          <input
            type="datetime-local"
            value={formData.incidentDate}
            onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block mb-2">Upload Documents</label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
          <p className="text-sm text-gray-600 mt-1">
            Upload images of the incident (JPEG/PNG, max 10MB each)
          </p>
          {formData.documents.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Selected files:</p>
              <ul className="list-disc list-inside">
                {formData.documents.map((file, index) => (
                  <li key={index} className="text-sm">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!verificationStatus.policyFound || isSubmitting}
          className={`w-full p-3 rounded text-white ${
            !verificationStatus.policyFound || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#003366] hover:bg-[#002244]'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Claim'}
        </button>
      </form>
    </div>
  );
} 