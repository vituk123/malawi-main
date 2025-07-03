import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/core/Input';
import Button from '../../components/core/Button';
import { applyForJob, getJobById } from '../../services/api';
import useAuthStore from '../../store/authStore';

const JobApplicationForm: React.FC = () => {
  const [jobId, setJobId] = useState<string | undefined>(undefined);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Job ID from URL
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      setJobId(id);
      const fetchJob = async () => {
        try {
          const jobData = await getJobById(id);
          setJobTitle(jobData.title);
        } catch (err) {
          setError('Failed to load job details.');
        }
      };
      fetchJob();
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!jobId || !user?.id) {
      setError('Job ID or User ID is missing.');
      return;
    }

    // In a real application, you'd upload the resume file and get a URL/ID
    // For now, we'll just pass a placeholder or handle it as a string if backend expects base64
    // This example assumes the backend expects a string path or similar for resume
    const applicationData = {
      jobId: Number(jobId),
      userId: user.id, // Assuming userId is available from auth store
      coverLetter,
      resumeUrl: resume ? `/uploads/${resume.name}` : '', // Placeholder
    };

    try {
      await applyForJob(applicationData);
      setMessage('Application submitted successfully!');
      setTimeout(() => navigate('/my-applications'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Apply for {jobTitle ? ` ${jobTitle}` : 'Job'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              id="coverLetter"
              label="Cover Letter"
              type="textarea"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="resume" className="block text-gray-700 text-sm font-bold mb-2">
              Resume (Upload File)
            </label>
            <input
              type="file"
              id="resume"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {resume && <p className="text-sm text-gray-500 mt-1">Selected file: {resume.name}</p>}
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;
