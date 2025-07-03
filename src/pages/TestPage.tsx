import React, { useState, useEffect } from 'react';
import { getPublicContent, getUserContent, getEmployerContent, getAdminContent } from '../services/api';
import useAuthStore from '../store/authStore';

const TestPage: React.FC = () => {
  const [publicContent, setPublicContent] = useState('');
  const [userContent, setUserContent] = useState('');
  const [employerContent, setEmployerContent] = useState('');
  const [adminContent, setAdminContent] = useState('');
  const [error, setError] = useState('');

  const { isLoggedIn, roles } = useAuthStore();

  useEffect(() => {
    const fetchContent = async () => {
      setError('');
      try {
        const publicRes = await getPublicContent();
        setPublicContent(publicRes);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch public content');
      }

      if (isLoggedIn) {
        try {
          const userRes = await getUserContent();
          setUserContent(userRes);
        } catch (err: any) {
          setUserContent('Access Denied for User Content.');
        }

        if (roles.includes('ROLE_EMPLOYER') || roles.includes('ROLE_ADMIN')) {
          try {
            const employerRes = await getEmployerContent();
            setEmployerContent(employerRes);
          } catch (err: any) {
            setEmployerContent('Access Denied for Employer Content.');
          }
        }

        if (roles.includes('ROLE_ADMIN')) {
          try {
            const adminRes = await getAdminContent();
            setAdminContent(adminRes);
          } catch (err: any) {
            setAdminContent('Access Denied for Admin Content.');
          }
        }
      }
    };

    fetchContent();
  }, [isLoggedIn, roles]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Test Endpoints</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold mb-2">Public Content (/api/test/all)</h3>
        <p>{publicContent}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold mb-2">User Content (/api/test/user)</h3>
        <p>{userContent}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold mb-2">Employer Content (/api/test/employer)</h3>
        <p>{employerContent}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold mb-2">Admin Content (/api/test/admin)</h3>
        <p>{adminContent}</p>
      </div>
    </div>
  );
};

export default TestPage;
