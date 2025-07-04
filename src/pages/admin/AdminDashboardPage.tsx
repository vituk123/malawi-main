import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser, getAllCompaniesAdmin, verifyCompanyAdmin } from '../../services/api';
import { User } from '../../types'; // Assuming you have a User type
import { Company } from '../../types'; // Assuming you have a Company type

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.roles.includes('admin')) {
      // Redirect to homepage or a forbidden page if not admin
      navigate('/');
    }
  }, [user, navigate]);

  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [errorCompanies, setErrorCompanies] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getAllUsers();
        setUsers(userData);
      } catch (err: any) {
        setErrorUsers('Failed to fetch users: ' + err.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchCompanies = async () => {
      try {
        const companyData = await getAllCompaniesAdmin();
        setCompanies(companyData);
      } catch (err: any) {
        setErrorCompanies('Failed to fetch companies: ' + err.message);
      } finally {
        setLoadingCompanies(false);
      }
    };

    if (user && user.roles.includes('admin')) {
      fetchUsers();
      fetchCompanies();
    }
  }, [user]);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err: any) {
        setErrorUsers('Failed to delete user: ' + err.message);
      }
    }
  };

  const handleVerifyCompany = async (companyId: string) => {
    if (window.confirm('Are you sure you want to verify this company?')) {
      try {
        await verifyCompanyAdmin(companyId);
        setCompanies(companies.map(company => company.id === companyId ? { ...company, verified: true } : company));
      } catch (err: any) {
        setErrorCompanies('Failed to verify company: ' + err.message);
      }
    }
  };

  if (!user || !user.roles.includes('admin')) {
    // Render nothing or a loading indicator while redirecting
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">User Management</h2>
        {loadingUsers && <p>Loading users...</p>}
        {errorUsers && <p className="text-red-500">{errorUsers}</p>}
        {!loadingUsers && !errorUsers && users.length === 0 && <p>No users found.</p>}
        {!loadingUsers && !errorUsers && users.length > 0 && (
          <ul>
            {users.map(user => (
              <li key={user.id} className="mb-2 flex justify-between items-center border-b border-gray-200 pb-2">
                <span>{user.username} ({user.email})</span>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Company Management</h2>
        {/* Placeholder for Company Management features */}
        <p className="text-gray-600">Implement company listing, editing, deletion, and verification here.</p>
      </section>
        {loadingCompanies && <p>Loading companies...</p>}
        {errorCompanies && <p className="text-red-500">{errorCompanies}</p>}
        {!loadingCompanies && !errorCompanies && companies.length === 0 && <p>No companies found.</p>}
        {!loadingCompanies && !errorCompanies && companies.length > 0 && (
          <ul>
            {companies.map(company => (
              <li key={company.id} className="mb-2 flex justify-between items-center border-b border-gray-200 pb-2">
                <span>{company.name} ({company.location}) {company.verified && <span className="text-green-500 text-xs">(Verified)</span>}</span>
                {!company.verified && (
                  <button
                    onClick={() => handleVerifyCompany(company.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Verify
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Job Management</h2>
        {/* Placeholder for Job Management features */}
        <p className="text-gray-600">Implement job listing, editing, and deletion here.</p>
      </section>

      {/* Add more admin sections as needed */}
    </div>
  );
};

export default AdminDashboardPage;