import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/core/Input';
import Button from '../../components/core/Button';
import useAuthStore from '../../store/authStore';
import { createJob, updateJob, getJobById } from '../../services/api';

interface JobFormProps {
  isEditMode?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ isEditMode = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState<number | string>('');
  const [jobType, setJobType] = useState('');
  const [companyId, setCompanyId] = useState<number | string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state for role check
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { roles } = useAuthStore.getState();
  useEffect(() => {
    if (isEditMode && jobId) {
      const fetchJob = async () => {
        try {
          const data = await getJobById(jobId);
          setTitle(data.title);
          setDescription(data.description);
          setLocation(data.location);
          setSalary(data.salary);
          setJobType(data.jobType);
          setCompanyId(data.companyId);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch job details');
        }
      };
      fetchJob();
    }
  }, [isEditMode, jobId]);

  // Check user role on component mount
  useEffect(() => {
    if (!roles.includes('employer')) {
      setError('You do not have permission to post jobs.');
      setLoading(false); // Set loading to false even if not authorized
    } else {
      setError(''); // Clear any previous error
      setLoading(false); // Set loading to false if authorized
    }
  }, [roles, isEditMode, jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const jobData = {
      title,
      description,
      location,
      salary: Number(salary),
      jobType,
      companyId: Number(companyId),
    };

    try {
      if (isEditMode && jobId) {
        await updateJob(jobId, jobData);
        setMessage('Job updated successfully!');
      } else {
        await createJob(jobData);
        setMessage('Job created successfully!');
      }
      setTimeout(() => navigate('/jobs'), 2000); // Redirect after success
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error && !loading) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isEditMode ? 'Edit Job' : 'Create Job'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              id="title"
              label="Job Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              required
            />
          </div>
          <div className="mb-4">
            <Input
              id="location"
              label="Location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              id="salary"
              label="Salary"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              id="jobType"
              label="Job Type"
              type="text"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Input
              id="companyId"
              label="Company ID"
              type="number"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
            />
          </div>
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          <Button type="submit" className="w-full">
            {isEditMode ? 'Update Job' : 'Create Job'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
