import { useState } from 'react';
import { useRouter } from 'next/router';
import { uploadFile } from '../lib/azure';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUpload = async () => {
    if (!consent) {
      setError('Consent required');
      return;
    }
    if (!file || file.size > 10 * 1024 * 1024) {
      setError('File must be JPEG/PNG, <10MB');
      return;
    }
    try {
      const imageUrl = await uploadFile(file, `images/${Date.now()}_${file.name}`);
      localStorage.setItem('image_url', imageUrl);
      localStorage.setItem('consent', 'true');
      router.push('/verification');
    } catch (err) {
      setError('Upload failed');
    }
  };

  return (
    <div className="text-center p-8">
      <img src="/protea.png" alt="Protea" className="mx-auto mb-4 w-12" />
      <h2 className="text-2xl mb-4">Upload Claim Image</h2>
      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={(e) => setFile(e.target.files[0])}
        className="block mx-auto mb-2"
      />
      <label className="block mb-2">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        I consent to data processing per POPIA
      </label>
      <button onClick={handleUpload} disabled={!consent}>Upload</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
} 