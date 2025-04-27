import React from 'react';
import QRCode from 'qrcode.react';

interface CertificateQRCodeProps {
  certId: string;
}

const CertificateQRCode: React.FC<CertificateQRCodeProps> = ({ certId }) => {
  const certUrl = `https://mynomad-app1.windsurf.build/certificates/${certId}`;

  const handleDownload = () => {
    const canvas = document.getElementById(`qr-canvas-${certId}`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-qr-${certId}.png`;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <QRCode
        id={`qr-canvas-${certId}`}
        value={certUrl}
        size={96}
        level="H"
        includeMargin={true}
      />
      <button
        onClick={handleDownload}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-opensans"
      >
        Download QR
      </button>
      <a
        href={certUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-700 underline mt-1"
      >
        View Certificate
      </a>
    </div>
  );
};

export default CertificateQRCode;
