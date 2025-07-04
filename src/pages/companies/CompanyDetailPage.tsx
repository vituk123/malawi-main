import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCompanyById } from '../../services/api';

interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  // Add other company properties as needed
}

const CompanyDetailPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (companyId) {
          setLoading(true);
          const data = await getCompanyById(companyId);
          setCompany(data);
        }
      } catch (err) {
        setError('Failed to fetch company details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  if (loading) {
    return <div>Loading company details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!company) {
    return <div>Company not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{company.name}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <span className="mr-4"><strong className="font-semibold">Industry:</strong> {company.industry}</span>
          {/* Add location if available in Company interface */}
          {/* <span><strong className="font-semibold">Location:</strong> {company.location}</span> */}
        </div>
        <p className="text-gray-700 leading-relaxed">{company.description}</p>
        {/* You can add a section here to list jobs posted by this company */}
      </div>
    </div>
  );
};

export default CompanyDetailPage;