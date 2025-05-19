import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/router';

export default function Login() {
  const { instance } = useMsal();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await instance.loginPopup();
      router.push('/upload');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="text-center p-8">
      <img src="/logo.png" alt="Detachd Logo" className="mx-auto mb-4 w-24" />
      <h2 className="text-2xl mb-4">Login</h2>
      <button onClick={handleLogin}>Login with Entra ID</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
} 