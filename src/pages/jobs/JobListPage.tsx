import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllJobs, searchJobs, filterJobs, deleteJob } from '../../services/api';
import Input from '../../components/core/Input';
import Button from '/home/user/malawi-main/src/components/core/Button.tsx';
import JobCard from '../../components/job/JobCard';
import useAuthStore from '../../store/authStore';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  jobType: string;
  companyName: string;
}

const JobListPage: React.FC = () => { 
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);


  // Search and Filter states
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [filterMinSalary, setFilterMinSalary] = useState<number | string>('');
  const [filterMaxSalary, setFilterMaxSalary] = useState<number | string>('');
  const [filterJobType, setFilterJobType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [filterEducation, setFilterEducation] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [filterPostingDate, setFilterPostingDate] = useState('');
  const [message, setMessage] = useState('');

  const { roles } = useAuthStore();
  const isEmployerOrAdmin = roles.includes('ROLE_EMPLOYER') || roles.includes('ROLE_ADMIN');

  const pageSize = 10; // Define page size
 
  const fetchJobs = useCallback(async (currentPage = 0) => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (searchTitle || searchLocation || searchCompany) {
        data = await searchJobs(searchTitle, searchLocation, searchCompany, currentPage, pageSize);
      } else if (filterMinSalary || filterMaxSalary || filterJobType || filterLocation) {
        data = await filterJobs(
          Number(filterMinSalary) || 0,
          Number(filterMaxSalary) || 999999999,
          filterJobType,
          filterLocation,
          currentPage,
          pageSize
        );
      } else {
        data = await getAllJobs(currentPage, pageSize);
      }
      setJobs(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [searchTitle, searchLocation, searchCompany, filterMinSalary, filterMaxSalary, filterJobType, filterLocation]); // Add dependencies for useCallback

  // Update useEffect to use currentPage directly for dependencies
  useEffect(() => {
    // When search/filter parameters change, reset page to 0
 if (searchTitle || searchLocation || searchCompany || filterMinSalary || filterMaxSalary || filterJobType || filterLocation) {
 if (currentPage !== 0) setCurrentPage(0); // Only refetch if not already on the first page
 else fetchJobs(0); // Fetch if already on the first page
    } else {
    fetchJobs();
    }
  }, [fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterMinSalary('');
    setFilterMaxSalary('');
    setFilterJobType('');
    setFilterLocation('');
    fetchJobs(0);
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTitle('');
    setSearchLocation('');
    setSearchCompany('');
    fetchJobs(0);
  };

  const handleDelete = async (jobId: string) => {
 if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId);
        setMessage('Job deleted successfully.');
        fetchJobs(currentPage); // Refresh current page
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary-800">Job Listings</h2>

 <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Search Jobs</h3>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            id="searchTitle"
            label="Title"
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <Input
            id="searchLocation"
            label="Location"
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <Input
            id="searchCompany"
            label="Company"
            type="text"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
          />
          <Button type="submit" className="w-full md:w-auto">Search</Button>
        </form>
      </div>

 <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Filter Jobs</h3>
        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Input
            id="filterMinSalary"
            label="Min Salary"
            type="number"
            value={filterMinSalary}
            onChange={(e) => setFilterMinSalary(e.target.value)}
          />
          <Input
            id="filterMaxSalary"
            label="Max Salary"
            type="number"
            value={filterMaxSalary}
            onChange={(e) => setFilterMaxSalary(e.target.value)}
          />
          <Input
            id="filterJobType"
            label="Job Type"
            type="text"
            value={filterJobType}
            onChange={(e) => setFilterJobType(e.target.value)}
          />
          <Input
            id="filterLocation"
            label="Location"
            type="text"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />
 {/* Placeholder for additional filter criteria */}
          <Input
            id="filterExperience"
            label="Experience Level"
            type="text"
            value={filterExperience}
            onChange={(e) => setFilterExperience(e.target.value)}
          />
          <Input
            id="filterEducation"
            label="Education Level"
            type="text"
            value={filterEducation}
            onChange={(e) => setFilterEducation(e.target.value)}
          />
          <Input
            id="filterPostingDate"
            label="Posting Date"
            type="date" // Using type="date" for a date picker input
            value={filterPostingDate}
            onChange={(e) => setFilterPostingDate(e.target.value)}
          />
          <Button type="submit" className="w-full md:w-auto">Filter</Button>
        </form>
      </div>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}
      {message && <p className="text-green-600 text-center mb-6">{message}</p>}
      {loading && <p className="text-center">Loading jobs...</p>}
      {!loading && jobs.length === 0 && <p className="text-center text-gray-600">No jobs found matching your criteria.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job}>
            <div className="mt-4 flex space-x-2">
              <Link to={`/jobs/${job.id}`}>
                <Button>View Details</Button>
              </Link>
              {isEmployerOrAdmin && (
                <>
                  <Link to={`/jobs/edit/${job.id}`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <Button onClick={() => handleDelete(job.id)} variant="danger">
                    Delete
                  </Button>
                </>
              )}
            </div>
          </JobCard>
        ))}
      </div>

 <div className="flex justify-center items-center mt-8 space-x-4">
        <Button onClick={() => fetchJobs(currentPage - 1)} disabled={currentPage === 0}>
          Previous
        </Button>
        <span>Page {currentPage + 1} of {totalPages}</span>
        <Button onClick={() => fetchJobs(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>
          Next
        </Button>
      </div>

      {isEmployerOrAdmin && (
        <div className="text-center mt-8">
          <Link to="/jobs/create">
            <Button>Create New Job</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobListPage;
