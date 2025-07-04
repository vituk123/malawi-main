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
  // Assuming the API will return pagination info
  totalItems?: number;
}

const CompanyListPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchIndustry, setSearchIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed page
  const [itemsPerPage] = useState(10); // You can make this dynamic
  const [totalPages, setTotalPages] = useState(0);

  const { roles, token } = useAuthStore();
  const isAdmin = roles?.includes('ROLE_ADMIN');

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // Using searchCompanies with empty parameters to get all companies
      const response = await searchCompanies(searchName, searchIndustry, currentPage, itemsPerPage);
      setCompanies(response.content); // Assuming the API returns content in a 'content' field
      setTotalPages(response.totalPages); // Assuming the API returns total pages
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch companies');
    }
   finally {
      setLoading(false);
    }

  }, [searchName, searchIndustry, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchCompanies();

  }, [fetchCompanies, currentPage]); // Add currentPage to dependencies

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    // Basic pagination controls
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">Explore Companies</h2>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
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
            placeholder="e.g., Technology, Finance"
            value={searchIndustry}
 onChange={(e) => setSearchIndustry(e.target.value)}
          />
          <Button type="submit" className="w-full md:w-auto">
            Search
          </Button>
        </form>
      </div>

      {error && <p className="text-red-600 text-center mb-6">{error}</p>}
      {message && <p className="text-green-600 text-center mb-6">{message}</p>}
      {loading && (
        <div className="flex justify-center items-center">
          <p className="text-center text-gray-600">Loading companies...</p> {/* You can replace this with a spinner */}
        </div>
      )}

      {!loading && companies.length === 0 && (
        <p className="text-center text-gray-600 text-lg">No companies found matching your criteria.</p>
      )}

      {!loading && companies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div key={company.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-200 ease-in-out">
              <Link to={`/companies/${company.id}`} className="block">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{company.name}</h3>
                <p className="text-gray-600 text-sm mb-1">Industry: {company.industry}</p>
                {/* <p className="text-gray-600 text-sm mb-1">{company.description}</p> // Description might be too long for card */}
                <p className="text-gray-600 text-sm mb-1">Location: {company.address || 'N/A'}</p>
                <p className="text-blue-600 text-sm hover:underline mb-4">Website: {company.website || 'N/A'}</p>
                <p className={`font-semibold text-sm ${company.verified ? 'text-green-600' : 'text-red-600'}`}>
                  Status: {company.verified ? 'Verified' : 'Unverified'}
                </p>
              </Link>
              <div className="mt-4 flex space-x-3">
                {/* Assuming edit requires a different page/form */}
                {/* <Link to={`/companies/edit/${company.id}`}>
                  <Button size="sm">Edit</Button>
                </Link> */}
                {isAdmin && !company.verified && (
                  <Button onClick={() => handleVerify(company.id)} variant="secondary" size="sm">
                    Verify
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-8">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
            Previous
          </Button>
          <span className="text-lg font-semibold">Page {currentPage + 1} of {totalPages}</span>
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
            Next
          </Button>
        </div>
      )}

      <div className="text-center mt-10">
        <Link to="/companies/register">
          <Button>Register New Company</Button>
        </Link>
      </div>
    </div>
  );
};

export default CompanyListPage;
