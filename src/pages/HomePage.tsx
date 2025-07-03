import React from 'react';
import JobCard from '../components/job/JobCard';

const HomePage: React.FC = () => {
  const featuredJobs = [
    {
      id: '1',
      title: 'Software Engineer',
      companyName: 'Tech Solutions',
      location: 'Blantyre, Malawi',
      salary: 50000,
      jobType: 'Full-time',
      description: 'Developing and maintaining web applications.',
      status: 'New',
    },
    {
      id: '2',
      title: 'Marketing Manager',
      companyName: 'Creative Agency',
      location: 'Lilongwe, Malawi',
      salary: 45000,
      jobType: 'Full-time',
      description: 'Leading marketing campaigns and strategies.',
      status: 'Featured',
    },
    {
      id: '3',
      title: 'Data Analyst',
      companyName: 'Data Insights Inc.',
      location: 'Zomba, Malawi',
      salary: 38000,
      jobType: 'Contract',
      description: 'Analyzing data and generating insights.',
      status: 'Pending',
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg shadow-lg mb-10">
        <h2 className="text-4xl font-bold mb-4">Find Your Dream Job in Malawi</h2>
        <p className="text-xl mb-8">Explore exciting opportunities across various industries.</p>
        {/* Search Bar Placeholder */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search for jobs..."
            className="w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Jobs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
