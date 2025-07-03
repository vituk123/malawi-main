import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/core/Input';
import Button from '../../components/core/Button';
import { registerCompany, updateCompany, getCompanyById } from '../../services/api';

interface CompanyFormProps {
  isEditMode?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ isEditMode = false }) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();

  useEffect(() => {
    if (isEditMode && companyId) {
      const fetchCompany = async () => {
        try {
          const data = await getCompanyById(companyId);
          setName(data.name);
          setIndustry(data.industry);
          setDescription(data.description);
          setAddress(data.address);
          setWebsite(data.website);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch company details');
        }
      };
      fetchCompany();
    }
  }, [isEditMode, companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const companyData = { name, industry, description, address, website };

    try {
      if (isEditMode && companyId) {
        await updateCompany(companyId, companyData);
        setMessage('Company updated successfully!');
      } else {
        await registerCompany(companyData);
        setMessage('Company registered successfully!');
      }
      setTimeout(() => navigate('/companies'), 2000); // Redirect after success
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isEditMode ? 'Edit Company' : 'Register Company'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              id="name"
              label="Company Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              id="industry"
              label="Industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              id="description"
              label="Description"
              type="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              id="address"
              label="Address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              id="website"
              label="Website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          <Button type="submit" className="w-full">
            {isEditMode ? 'Update Company' : 'Register Company'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
