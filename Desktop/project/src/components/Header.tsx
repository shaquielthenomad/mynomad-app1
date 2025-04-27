import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isInsurerMode, setIsInsurerMode] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'insurer') {
      setIsInsurerMode(true);
    }
  }, [currentUser]);

  const handleModeToggle = () => {
    setIsInsurerMode(!isInsurerMode);
    navigate(isInsurerMode ? '/dashboard' : '/insurer-dashboard');
  };

  return (
    <header className="bg-primary-dark py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-secondary" />
        <h1 className="text-white font-montserrat text-xl font-bold">Detachd</h1>
      </div>
      <div className="flex items-center space-x-4">
        {currentUser?.role === 'insurer' && (
          <button
            onClick={handleModeToggle}
            className="flex items-center space-x-2 text-white text-sm bg-primary-light px-3 py-1 rounded-md hover:bg-blue-700 transition font-opensans"
          >
            <Users className="h-4 w-4" />
            <span>{isInsurerMode ? 'Switch to User View' : 'Switch to Insurer View'}</span>
          </button>
        )}
        <span className="text-silver-light text-sm font-opensans hidden sm:inline-block">
          {currentUser?.email}
        </span>
        <button 
          onClick={() => navigate('/upload')}
          className="text-white text-sm bg-primary-light px-3 py-1 rounded-md hover:bg-blue-700 transition font-opensans"
        >
          New Verification
        </button>
        <button 
          onClick={logout}
          className="text-white text-sm border border-silver px-3 py-1 rounded-md hover:bg-primary-light transition font-opensans"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;