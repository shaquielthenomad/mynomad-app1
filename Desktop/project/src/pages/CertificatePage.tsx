import React from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'qrcode.react';

// Demo data for now
type DemoCert = {
  policyholderName: string;
  verifiedAt: string;
  reviewComments: string;
};
const DEMO_CERTS: Record<string, DemoCert> = {
  'snz5aca': {
    policyholderName: 'John Doe',
    verifiedAt: '2025-04-28T00:17:17+07:00',
    reviewComments: 'All documents verified. No issues found.',
  },
};

const CertificatePage: React.FC = () => {
  const { certId } = useParams<{ certId: string }>();
  const cert = DEMO_CERTS[certId || 'snz5aca'] || {
    policyholderName: 'Demo User',
    verifiedAt: new Date().toISOString(),
    reviewComments: 'No comments yet.',
  };
  const certUrl = `https://mynomad-app1.windsurf.build/certificates/${certId}`;
  const verifiedDate = new Date(cert.verifiedAt).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' });

  const handleShare = () => {
    const shareUrl = encodeURIComponent(certUrl);
    window.open(`https://wa.me/?text=View%20my%20certificate%20at%20${shareUrl}`);
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 font-montserrat">
      {/* Demo Mode Banner */}
      <div className="fixed top-0 left-0 w-full bg-yellow-400 text-center py-2 text-xs font-bold z-50 shadow">DEMO MODE – Y Combinator Edition</div>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 flex flex-col items-center relative">
        {/* Logo */}
        <img src="/logo192.png" alt="Detachd Logo" className="w-16 h-16 mb-2" />
        <h1 className="text-2xl font-bold text-primary mb-4">Certificate of Verification</h1>
        <div className="mb-2 text-gray-700">Certificate ID: <span className="font-semibold">{certId}</span></div>
        <div className="mb-2 text-gray-700">Policyholder: <span className="font-semibold">{cert.policyholderName}</span></div>
        <div className="mb-2 text-gray-700">Verified At: <span className="font-semibold">{verifiedDate}</span></div>
        <div className="mb-4 text-gray-700">Review Comments: <span className="font-semibold">{cert.reviewComments}</span></div>
        <QRCode value={certUrl} size={128} level="H" includeMargin={true} className="mb-4" />
        <button onClick={handleShare} className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Share via WhatsApp</button>
        <button onClick={() => navigator.clipboard.writeText(certUrl)} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Copy Link</button>
        <a href={`mailto:?subject=View%20my%20certificate&body=See%20my%20certificate%20at%20${certUrl}`} className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">Share via Email</a>
        <Link to="/" className="mt-4 text-blue-700 underline text-xs">Back to Home</Link>
        <button
          className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-xs"
          onClick={() => window.open('mailto:founder@detachd.com?subject=YC%20Demo%20Contact')}
        >Contact Us / Book a Demo</button>
        <div className="mt-6 text-xs text-gray-500">POPIA Compliant • For South African Use</div>
        <div className="absolute bottom-2 right-4 text-xs text-gray-400 opacity-60">Verified by Detachd</div>
      </div>
      {/* Why Detachd Section */}
      <div className="mt-8 max-w-md w-full bg-white rounded-lg shadow p-4 text-sm text-gray-700">
        <h2 className="font-bold mb-2 text-primary">Why Detachd?</h2>
        <ul className="list-disc ml-6">
          <li>Trusted, tamper-proof digital certificates for South Africa</li>
          <li>POPIA compliant & privacy-first</li>
          <li>Instant verification and easy sharing for insurers, users, and partners</li>
        </ul>
      </div>
    </div>
  );
};

export default CertificatePage;
