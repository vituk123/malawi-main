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
  const [validationErrors, setValidationErrors] = useState({
    coverLetter: '',
    resume: ''
  });

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

  // This function needs to handle file upload properly. For now, it's a placeholder.
  const uploadResume = async (file: File): Promise<string> => {
    // Implement actual file upload logic here (e.g., to a backend endpoint or cloud storage)
    // This is a placeholder and will not work for real file uploads.
    console.warn('Resume upload not implemented. Using placeholder.');
    return `/uploads/${file.name}`; // Placeholder URL
  };

  const validateForm = () => {
    const errors: { coverLetter: string; resume: string } = { coverLetter: '', resume: '' };
    let isValid = true;

    if (!coverLetter.trim()) {
      errors.coverLetter = 'Cover letter is required.';
      isValid = false;
    }
    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // In a real application, you'd upload the resume file and get a URL/ID
    // For now, we'll just pass a placeholder or handle it as a string if backend expects base64
    // This example assumes the backend expects a string path or similar for resume
    const applicationData = {
      jobId: Number(jobId),
      userId: user?.id, // Assuming userId is available from auth store
      coverLetter,
      resumeUrl: '', // Will be updated after upload
    };

    if (!validateForm()) {
      return;
    }

    try {
      setError('');
      setMessage('');
      setValidationErrors({ coverLetter: '', resume: '' }); // Clear previous validation errors

      if (!jobId || !user?.id) {
        // This case should ideally be handled by route protection or component logic
        // but adding a check here as a safeguard.
        console.error("Job ID or User ID is missing for application.");
        setError('Job ID or User ID is missing.');
        return;
      }

      // Assuming resume upload is handled separately and returns a URL
      // In a real app, you'd await uploadResume(resume) if resume exists
      await applyForJob(applicationData);
      setMessage('Application submitted successfully!');
      // Optionally redirect or show a success message and keep user on page
      // setTimeout(() => navigate('/my-applications'), 2000); // Example redirect
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Apply for {jobTitle ? ` ${jobTitle}` : 'Job'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="coverLetter" className="block text-gray-700 text-sm font-semibold mb-2">
              Cover Letter
            </label>
            {/* Using a standard textarea for better control over styling */}
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 ease-in-out"
              rows={6}
            // removed required attribute as we are using custom validation
            />
            {validationErrors.coverLetter && <p className="text-red-500 text-sm mt-1">{validationErrors.coverLetter}</p>}

          </div>
          <div className="mb-6">
            <label htmlFor="resume" className="block text-gray-700 text-sm font-semibold mb-2">
              Resume (Upload File)
            </label>
            {/* Styling for file inputs is tricky with Tailwind.
                Using a basic input with some custom styling for appearance. */}
            <input
              type="file"
              id="resume"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-primary-50 file:text-primary-700
                         hover:file:bg-primary-100"
            />
            {resume && <p className="text-sm text-gray-500 mt-1">Selected file: {resume.name}</p>}
            {validationErrors.resume && <p className="text-red-500 text-sm mt-1">{validationErrors.resume}</p>}
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
