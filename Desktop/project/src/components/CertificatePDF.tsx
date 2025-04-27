import React from 'react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode.react';

interface CertificatePDFProps {
  certId: string;
  policyholderName: string;
  reviewComments?: string;
  verifiedAt: string;
}

const CertificatePDF: React.FC<CertificatePDFProps> = ({ certId, policyholderName, reviewComments, verifiedAt }) => {
  const certUrl = `https://mynomad-app1.windsurf.build/certificates/${certId}`;

  const handleDownloadPDF = async () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    doc.setFont('helvetica');
    doc.setFontSize(22);
    doc.text('Certificate of Verification', 40, 60);
    doc.setFontSize(14);
    doc.text(`Certificate ID: ${certId}`, 40, 100);
    doc.text(`Policyholder: ${policyholderName}`, 40, 125);
    doc.text(`Verified At: ${verifiedAt}`, 40, 150);
    doc.setFontSize(12);
    doc.text('Scan the QR code below to view this certificate online:', 40, 180);
    // Generate QR code as data URL
    const qrCanvas = document.createElement('canvas');
    // @ts-ignore
    QRCode.toCanvas(qrCanvas, certUrl, { width: 96 });
    const qrDataUrl = qrCanvas.toDataURL('image/png');
    doc.addImage(qrDataUrl, 'PNG', 40, 190, 96, 96);
    doc.setFontSize(12);
    doc.text('Certificate Review Comments:', 40, 310);
    doc.setFontSize(11);
    doc.text(reviewComments || 'No comments left by insurer.', 40, 330, { maxWidth: 500 });
    doc.setFontSize(10);
    doc.text('POPIA Compliant • For South African Use', 40, 550);
    doc.save(`certificate-${certId}.pdf`);
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="px-3 py-1 bg-green-700 text-white rounded hover:bg-green-800 text-xs font-opensans mt-2"
    >
      Download Certificate (PDF)
    </button>
  );
};

export default CertificatePDF;
