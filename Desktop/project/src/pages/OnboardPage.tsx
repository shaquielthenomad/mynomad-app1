import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const INSURERS = ['Discovery Insure', 'Clientele Life', 'Sanlam'];

const OnboardPage = () => {
  const [step, setStep] = useState(1);
  const [inviteCode, setInviteCode] = useState('');
  const [insurerName, setInsurerName] = useState('');
  const [insuranceType, setInsuranceType] = useState<'personal' | 'corporate' | ''>('');
  const [idLastFour, setIdLastFour] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { verifyInviteCode, registerUser } = useAuth();
  const navigate = useNavigate();

  const handleInviteCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await verifyInviteCode(inviteCode);
      if (result.valid && result.insurerName) {
        setInsurerName(result.insurerName);
        setStep(2);
      } else {
        setError('Invalid invite code. Please contact your insurance provider.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await registerUser({
        email,
        insurerName,
        insuranceType,
        idLastFour,
        role: 'policyholder',
        inviteCode,
      });

      if (success) {
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <Shield className="w-16 h-16 text-secondary mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white font-montserrat">Welcome to Detachd</h1>
        <p className="text-silver-light mt-2 font-opensans">Let's get you set up</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                s === step
                  ? 'bg-secondary text-white'
                  : s < step
                  ? 'bg-secondary-light text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleInviteCodeSubmit} className="space-y-6">
            <div>
              <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1 font-opensans">
                Enter your invite code
              </label>
              <input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., DISC2025"
                required
              />
              <p className="mt-2 text-sm text-gray-500 font-opensans">
                Don't have an invite code? Please contact an authorized insurance partner to use our service.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inviteCode}
              className="w-full bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-4 rounded-md transition duration-200 font-opensans disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Verify Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-opensans">
                Select your insurance provider
              </label>
              <select
                value={insurerName}
                onChange={(e) => setInsurerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select provider</option>
                {INSURERS.map((insurer) => (
                  <option key={insurer} value={insurer}>
                    {insurer}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-opensans">
                Insurance Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setInsuranceType('personal')}
                  className={`p-4 border rounded-md text-center ${
                    insuranceType === 'personal'
                      ? 'border-secondary bg-secondary bg-opacity-10'
                      : 'border-gray-300 hover:border-secondary'
                  }`}
                >
                  <p className="font-medium font-opensans">Personal</p>
                  <p className="text-sm text-gray-500 font-opensans">Home, Life, etc.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setInsuranceType('corporate')}
                  className={`p-4 border rounded-md text-center ${
                    insuranceType === 'corporate'
                      ? 'border-secondary bg-secondary bg-opacity-10'
                      : 'border-gray-300 hover:border-secondary'
                  }`}
                >
                  <p className="font-medium font-opensans">Corporate</p>
                  <p className="text-sm text-gray-500 font-opensans">Business, Work, etc.</p>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="idLastFour" className="block text-sm font-medium text-gray-700 mb-1 font-opensans">
                Last 4 digits of SA ID
              </label>
              <input
                id="idLastFour"
                type="text"
                maxLength={4}
                value={idLastFour}
                onChange={(e) => setIdLastFour(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 3087"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!insurerName || !insuranceType || !idLastFour}
              className="w-full bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-4 rounded-md transition duration-200 font-opensans disabled:opacity-70 flex items-center justify-center"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-opensans">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 font-opensans">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-4 rounded-md transition duration-200 font-opensans disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-4" />
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 font-opensans">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-secondary hover:text-secondary-light font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardPage;