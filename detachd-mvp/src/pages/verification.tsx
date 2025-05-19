import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { verifyImage, saveVerification } from '../lib/azure';

export default function Verification() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    async function processVerification() {
      const imageUrl = localStorage.getItem('image_url');
      const userId = localStorage.getItem('user_id') || 'demo_user';
      try {
        const result = await verifyImage(imageUrl);
        await saveVerification(userId, imageUrl, result.status, true);
        localStorage.setItem('verification_status', result.status);
        localStorage.setItem('confidence', result.confidence.toString());
        router.push('/result');
      } catch (err) {
        setError('Verification failed');
      }
    }
    processVerification();
  }, [router]);

  return (
    <div className="text-center p-8">
      <h2 className="text-2xl mb-4">Verifying...</h2>
      <img src="https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js" alt="Spinner" className="mx-auto" />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
} 