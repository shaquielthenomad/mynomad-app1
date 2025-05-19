import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center p-8">
      <img src="/logo.png" alt="Detachd Logo" className="mx-auto mb-4 w-24" />
      <h1 className="text-4xl mb-4">Stop Insurance Fraud with AI Verification</h1>
      <p className="text-xl mb-6">Prevent $500M–$1B in losses in South Africa's $40B market</p>
      <Link href="/login"><button>Login</button></Link>
    </div>
  );
} 