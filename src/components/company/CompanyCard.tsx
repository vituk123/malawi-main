import React from 'react';
import { Link } from 'react-router-dom';

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    industry: string;
    // Add other company properties you want to display
  };
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Link to={`/companies/${company.id}`} className="block text-gray-800">
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition duration-300 ease-in-out">
        <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
        <p className="text-gray-600">{company.industry}</p>
        {/* Add other company information here */}
      </div>
    </Link>
  );
};

export default CompanyCard;