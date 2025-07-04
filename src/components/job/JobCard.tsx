import React from 'react';
import StatusBadge from './StatusBadge';
import { Link } from 'react-router-dom';

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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 hover:shadow-md transition duration-200 ease-in-out">
      <Link to={`/jobs/${job.id}`}>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:underline cursor-pointer">{job.title}</h3>
      </Link>
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
