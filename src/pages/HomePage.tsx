import React from 'react';
import JobCard from '../components/job/JobCard';
// import { addRandomJobs } from '../services/api'; // Import the function
import { Link } from 'react-router-dom';
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
      {/* Hero Section - Lighter Aesthetic */}
      <section className="text-center py-32 bg-gray-100 text-gray-800 mb-10">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">Find Your Dream Job in <span className="text-primary-400">Malawi</span></h2>
        <p className="text-xl mb-8">Explore exciting opportunities across various industries.</p>
        {/* Search Bar Placeholder */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search for jobs..."
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800"
          />
        </div>
        {/* Temporary button to add jobs (Remove after populating) */}
        <div className="mt-10">
          {/* <button onClick={addRandomJobs} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add 20 Random Jobs (Temporary)
          </button> */}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Featured Jobs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      </section>

      {/* Job Categories Section - Placeholder */}
      <section className="mt-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h3>
        {/* Category buttons or links will go here */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Example Category Items (replace with dynamic data) */}
          {['Technology', 'Healthcare', 'Education', 'Agriculture', 'Finance', 'Tourism', 'Engineering', 'Sales'].map(
            (category, index) => (
              <Link
                key={index}
                to={`/jobs?category=${category}`}
                className="block p-4 bg-white rounded-lg shadow-md text-center hover:bg-gray-100 transition duration-200"
              >
                <p className="text-lg font-semibold text-gray-700">{category}</p>
              </Link>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
