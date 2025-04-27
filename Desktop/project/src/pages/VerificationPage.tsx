import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader } from 'lucide-react';
import { useVerification } from '../contexts/VerificationContext';

const VerificationPage = () => {
  const { currentVerification, processVerification } = useVerification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentVerification) {
      navigate('/upload');
      return;
    }

    const verifyImage = async () => {
      await processVerification();
      navigate('/result');
    };

    verifyImage();
  }, [currentVerification, processVerification, navigate]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="relative mb-8">
          <Shield className="h-20 w-20 text-secondary mx-auto animate-pulse-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="h-10 w-10 text-white animate-spin-slow" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white font-montserrat mb-4">
          Verifying Image
        </h1>
        
        <p className="text-silver-light max-w-md mx-auto font-opensans">
          Our advanced AI is analyzing your image for authenticity. 
          This process typically takes a few seconds.
        </p>

        <div className="mt-8">
          <div className="h-2 w-64 bg-primary-light rounded-full overflow-hidden">
            <div className="h-full bg-secondary animate-[width_5s_ease-in-out]" style={{width: '100%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;