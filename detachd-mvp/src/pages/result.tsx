import { useRouter } from 'next/router';
import { generateCertificate } from '../lib/azure';
import { useState } from 'react';

export default function Result() {
  const router = useRouter();
  const imageUrl = localStorage.getItem('image_url');
  const status = localStorage.getItem('verification_status');
  const confidence = localStorage.getItem('confidence');
  const userId = localStorage.getItem('user_id') || 'demo_user';
  const [pdfUrl, setPdfUrl] = useState('');

  const handleGenerateCertificate = async () => {
    try {
      const pdfUrl = await generateCertificate(imageUrl, status, userId, Date.now());
      setPdfUrl(pdfUrl);
    } catch (err) {
      alert('Certificate generation failed');
    }
  };

  return (
    <div className="text-center p-8">
      <h2 className="text-2xl mb-4">{status === 'verified' ? 'Image Verified' : 'Tampering Detected'}</h2>
      <p className="mb-4">Confidence: {(parseFloat(confidence) * 100).toFixed(2)}%</p>
      {imageUrl && <img src={imageUrl} alt="Uploaded" className="mx-auto mb-4 max-w-xs" />}
      {status === 'verified' && <img src="/seal.png" alt="Seal" className="absolute top-4 right-4 w-24" />}
      {status === 'verified' && !pdfUrl && (
        <button onClick={handleGenerateCertificate} className="mb-4">Generate Certificate</button>
      )}
      {pdfUrl && <a href={pdfUrl} download className="block mb-4 text-[#009933]">Download Certificate</a>}
      <button onClick={() => router.push('/upload')}>Retry</button>
    </div>
  );
} 