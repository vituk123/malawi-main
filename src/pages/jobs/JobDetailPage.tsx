import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getJobById } from '../../services/api'; // Adjust the import path if necessary

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  companyName?: string; // Assuming you want to display company name
  // Add other job properties as needed
}

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const jobData = await getJobById(jobId as string);
        setJob(jobData);
      } catch (err) {
        setError('Failed to load job details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  if (loading) {
    return <div>Loading job details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!job) {
    return <div>Job not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-primary-800 mb-2">{job.title}</h1>
        {job.companyName && (
          <p className="text-secondary-600 text-xl mb-4">{job.companyName}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary:</strong> {job.salary}</p>
          {/* Add more key details here */}
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-primary-700 mb-3">Job Description</h2>
          <p className="text-gray-800 leading-relaxed">{job.description}</p>
        </div>
        <button className="mt-8 px-6 py-3 bg-accent-500 text-white font-bold rounded-lg hover:bg-accent-600 transition duration-300">Apply Now</button>
      </div>
      {/* Add more job details here as needed */}
    </div>
  );
};

export default JobDetailPage;