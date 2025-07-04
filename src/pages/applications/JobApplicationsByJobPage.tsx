import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getApplicationsByJob, updateApplicationStatus } from '../../services/api';

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
  resumeUrl?: string;
  status: string;
}

const JobApplicationsByJobPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchApplications = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getApplicationsByJob(jobId);
      setApplications(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch applications.');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      setMessage(''); // Clear previous messages
      await updateApplicationStatus(applicationId, { status: newStatus });
      setMessage('Application status updated successfully!');
      fetchApplications(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6 text-primary-700">Applications for Job</h2>
      {/* You might want to fetch and display the job title here */}
      <p className="text-center text-gray-600 mb-8">Job ID: {jobId}</p>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {message && <p className="text-green-600 text-center mb-4 font-semibold">{message}</p>}

      {/* Placeholder for Filter and Sort controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="text-gray-700">Filter by Status:</label>
          <select
            id="statusFilter"
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
            // Add onChange handler and state for filtering
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="INTERVIEW">Interview</option>
            <option value="HIRED">Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sortBy" className="text-gray-700">Sort by:</label>
          <select
            id="sortBy"
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
            // Add onChange handler and state for sorting
          >
            <option value="dateAsc">Application Date (Oldest)</option>
            <option value="dateDesc">Application Date (Newest)</option>
            <option value="nameAsc">Applicant Name (A-Z)</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-center text-primary-600 font-semibold">Loading applications...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.length === 0 && !loading && !error && <p className="col-span-full text-center text-gray-600">No applications found for this job.</p>}
        {applications.map((app) => (
          <div key={app.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-2 text-primary-700">{app.applicantName}</h3>
            <p className="text-gray-700 mb-1"><span className="font-semibold">Email:</span> {app.applicantEmail}</p>
            <p className="text-gray-700 mb-1"><span className="font-semibold">Status:</span> <span className={`font-bold ${app.status === 'PENDING' ? 'text-yellow-600' : app.status === 'REVIEWED' ? 'text-blue-600' : app.status === 'INTERVIEW' ? 'text-purple-600' : app.status === 'HIRED' ? 'text-green-600' : 'text-red-600'}`}>{app.status}</span></p>
            <p className="text-gray-700 mb-2"><span className="font-semibold">Cover Letter:</span> {app.coverLetter}</p>
            {/* Consider adding a "Read More" or truncated view for long cover letters */}
            {app.resumeUrl && (
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Resume:</span> <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-accent-600 hover:underline">View Resume</a>
              </p>
            )}
            {/* Add more applicant details if available (e.g., skills, experience from profile) */}
            <div className="mt-4 flex flex-wrap gap-2">
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)} // Add confirmation here?
                className="block w-full md:w-auto shadow border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500 bg-white"
                aria-label="Update application status"
              >
                <option value="PENDING">Pending</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="INTERVIEW">Interview</option>
                <option value="HIRED">Hired</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        ))}
        {/* Add pagination controls here if you implement backend pagination */}
      </div>
    </div>
  );
};

export default JobApplicationsByJobPage;
