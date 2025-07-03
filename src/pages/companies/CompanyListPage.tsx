import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { searchCompanies, verifyCompany } from '../../services/api';
import Input from '../../components/core/Input';
import Button from '../../components/core/Button';
import useAuthStore from '../../store/authStore';

interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  address: string;
  website: string;
  verified: boolean;
}

const CompanyListPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchIndustry, setSearchIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { roles } = useAuthStore();
  const isAdmin = roles.includes('ROLE_ADMIN');

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await searchCompanies(searchName, searchIndustry);
      setCompanies(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  }, [searchName, searchIndustry]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]); // Initial fetch on component mount

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies();
  };

  const handleVerify = async (companyId: string) => {
    try {
      await verifyCompany(companyId);
      setMessage('Company verified successfully!');
      fetchCompanies(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify company');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Companies</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            id="searchName"
            label="Search by Name"
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Input
            id="searchIndustry"
            label="Search by Industry"
            type="text"
            value={searchIndustry}
            onChange={(e) => setSearchIndustry(e.target.value)}
          />
          <Button type="submit" className="w-full md:w-auto">
            Search
          </Button>
        </form>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {loading && <p className="text-center">Loading companies...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
            <p className="text-gray-600 mb-1">Industry: {company.industry}</p>
            <p className="text-gray-600 mb-1">{company.description}</p>
            <p className="text-gray-600 mb-1">Address: {company.address}</p>
            <p className="text-gray-600 mb-4">Website: <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.website}</a></p>
            <p className={`font-semibold ${company.verified ? 'text-green-600' : 'text-red-600'}`}>
              Status: {company.verified ? 'Verified' : 'Unverified'}
            </p>
            <div className="mt-4 flex space-x-2">
              <Link to={`/companies/edit/${company.id}`}>
                <Button>Edit</Button>
              </Link>
              {isAdmin && !company.verified && (
                <Button onClick={() => handleVerify(company.id)} variant="secondary">
                  Verify
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/companies/register">
          <Button>Register New Company</Button>
        </Link>
      </div>
    </div>
  );
};

export default CompanyListPage;
