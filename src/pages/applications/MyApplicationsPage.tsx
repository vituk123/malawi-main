import React, { useState, useEffect, useCallback } from 'react';
import { getApplicationsByUser, withdrawApplication } from '../../services/api';
import Button from '../../components/core/Button';
import useAuthStore from '../../store/authStore';

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  coverLetter: string;
  resumeUrl: string;
  status: string;
}


const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuthStore();

  const fetchMyApplications = useCallback(async () => {
    if (!user?.id) {
      setError('User not logged in.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getApplicationsByUser(user.id);
      setApplications(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch your applications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  const handleWithdraw = async (applicationId: string) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await withdrawApplication(applicationId);
        setMessage('Application withdrawn successfully!');
        fetchMyApplications(); // Refresh the list
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to withdraw application');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">My Job Applications</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {loading && <p className="text-center">Loading your applications...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.length === 0 && !loading && <p className="col-span-full text-center">You have not submitted any applications yet.</p>}
        {applications.map((app) => {
          let statusColor = 'text-gray-700'; // Default
          switch (app.status) {
            case 'Applied':
              statusColor = 'text-blue-600';
              break;
            case 'Under Review':
              statusColor = 'text-yellow-600';
              break;
            case 'Interview':
              statusColor = 'text-green-600';
              break;
            case 'Rejected':
              statusColor = 'text-red-600';
              break;
          }
          return (
            <div key={app.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">{app.jobTitle}</h3>
            <p className="text-gray-600 mb-1">Company: {app.companyName}</p>
            <p className="text-gray-600 mb-1">Status: <span className={`font-semibold ${statusColor}`}>{app.status}</span></p>
            <p className="text-gray-600 mb-2">Cover Letter: {app.coverLetter}</p>
            {app.resumeUrl && (
              <p className="text-gray-600 mb-4">
                Resume: <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Resume</a>
              </p>
            )}
            <div className="mt-4">
              <Button onClick={() => handleWithdraw(app.id)} variant="danger">
                Withdraw Application
              </Button>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
