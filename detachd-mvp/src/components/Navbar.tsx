import Link from 'next/link';
import { useMsal } from '@azure/msal-react';

export default function Navbar() {
  const { instance, accounts } = useMsal();
  const handleLogout = () => instance.logoutPopup();

  return (
    <nav className="bg-[#003366] p-4">
      <ul className="flex space-x-4 justify-center">
        {['Home', 'Login', 'Upload', 'Dashboard', 'About', 'Contact', 'Features', 'FAQ'].map((page) => (
          <li key={page}>
            <Link href={`/${page.toLowerCase()}`} className="text-[#C0C0C0] hover:text-white">{page}</Link>
          </li>
        ))}
        {accounts.length > 0 && (
          <li>
            <button onClick={handleLogout} className="text-[#C0C0C0] hover:text-white">Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
} 