import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { confirmRegistration } from '../../services/api';

const RegistrationConfirmPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying your account...');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      confirmRegistration(token)
        .then((response) => {
          setMessage(response.message);
          setIsError(false);
        })
        .catch((error) => {
          setMessage(error.response?.data?.message || 'Verification failed.');
          setIsError(true);
        });
    } else {
      setMessage('No verification token found.');
      setIsError(true);
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Account Verification</h2>
        <p className={isError ? 'text-red-500' : 'text-green-600'}>{message}</p>
        {!isError && (
          <p className="mt-4">
            You can now <a href="/signin" className="text-blue-600 hover:underline">Sign In</a>.
          </p>
        )}
      </div>
    </div>
  );
};

export default RegistrationConfirmPage;
