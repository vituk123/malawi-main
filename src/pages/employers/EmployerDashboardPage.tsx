import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
// Assuming you have a function to fetch jobs by company/employer in your api.ts
import { getJobsByCompany, deleteJob, showSuccessNotification, showErrorNotification } from '../../services/api';
interface Job {
  id: string;
  title: string;
  // Add other job properties you want to display
}

const EmployerDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostedJobs = async () => {
      if (user?.roles.includes('employer') && user.companyId) { // Assuming companyId is available in auth store
        setLoading(true);
        try {
          const data = await getJobsByCompany(user.companyId);
          setPostedJobs(data);
        } catch (err) {
          setError('Failed to fetch posted jobs.');
          console.error('Error fetching posted jobs:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPostedJobs();
  }, [user]);

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setLoading(true);
      try {
        await deleteJob(jobId);
        // Filter out the deleted job from the local state
        setPostedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
 showSuccessNotification('Job deleted successfully!');
      } catch (err) {
        setError('Failed to delete job.');
        console.error('Error deleting job:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  if (!user || !user.roles.includes('employer')) {
    return <div className="container mx-auto px-4 py-8 text-center text-neutral-700">You do not have permission to view this page.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>

      <div className="mb-6">
        <Link to="/post-job" className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg shadow hover:bg-primary-600 transition duration-200 text-lg font-semibold" aria-label="Post a New Job">
          Post New Job
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Your Posted Jobs</h2>
        {loading && <p>Loading jobs...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {postedJobs.length === 0 && !loading && !error && (
          <p className="text-neutral-600">Your posted jobs will appear here.</p>
          )}

        {postedJobs.map(job => (
          <div key={job.id} className="border-b border-gray-200 py-4 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex-grow mb-2 md:mb-0 md:mr-4">
              <h3 className="text-lg font-semibold text-primary-700">{job.title}</h3>
            </div>
            <div className="flex flex-col md:flex-row flex-shrink-0 space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <Link
                to={`/post-job/${job.id}`}
                className="text-secondary-600 hover:text-secondary-800 hover:underline text-sm md:text-base w-full md:w-auto text-center py-2 md:py-0 rounded md:rounded-none focus:outline-none focus:ring focus:ring-secondary-300"
                aria-label={`Edit job: ${job.title}`}

              >
                Edit
              </Link>
              <Link

                to={`/employer/jobs/${job.id}/applications`}
                className="text-primary-500 hover:underline text-sm md:text-base"
              >View Applications</Link>
 <button
 type="button"
 onClick={() => handleDeleteJob(job.id)}
 className="text-red-600 hover:text-red-800 hover:underline text-sm md:text-base focus:outline-none focus:ring focus:ring-red-300"
 aria-label={`Delete job: ${job.title}`}
 >
 Delete
 </button>
            {/* Add more job details and links to view applications */}
          </div>
        ))}
    </div>
  );
};

export default EmployerDashboardPage;