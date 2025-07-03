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
  resumeUrl: string;
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
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await updateApplicationStatus(applicationId, { status: newStatus });
      setMessage('Application status updated successfully!');
      fetchApplications(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Applications for Job ID: {jobId}</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {loading && <p className="text-center">Loading applications...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.length === 0 && !loading && <p className="col-span-full text-center">No applications found for this job.</p>}
        {applications.map((app) => (
          <div key={app.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{app.applicantName}</h3>
            <p className="text-gray-600 mb-1">Email: {app.applicantEmail}</p>
            <p className="text-gray-600 mb-1">Job Title: {app.jobTitle}</p>
            <p className="text-gray-600 mb-1">Status: <span className="font-bold">{app.status}</span></p>
            <p className="text-gray-600 mb-2">Cover Letter: {app.coverLetter}</p>
            {app.resumeUrl && (
              <p className="text-gray-600 mb-4">
                Resume: <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Resume</a>
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
      </div>
    </div>
  );
};

export default JobApplicationsByJobPage;
