import React from 'react';
import StatusBadge from './StatusBadge';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    companyName: string;
    location: string;
    salary: number;
    jobType: string;
    description: string;
    status?: string;
  };
  children?: React.ReactNode;
}

const JobCard: React.FC<JobCardProps> = ({ job, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4 transition-transform transform hover:scale-105">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{job.title}</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-1">{job.companyName} - {job.location}</p>
      <p className="text-gray-700 dark:text-gray-300 mb-1">Salary: ${job.salary.toLocaleString()}</p>
      <p className="text-gray-700 dark:text-gray-300 mb-1">Type: {job.jobType}</p>
      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{job.description}</p>
      <div className="flex items-center justify-between mt-4">
        {job.status && <StatusBadge status={job.status} />}
        {children}
      </div>
    </div>
  );
};

export default JobCard;
