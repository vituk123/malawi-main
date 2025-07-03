import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllJobs, searchJobs, filterJobs, deleteJob } from '../../services/api';
import Input from '../../components/core/Input';
import Button from '../../components/core/Button';
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
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search and Filter states
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [filterMinSalary, setFilterMinSalary] = useState<number | string>('');
  const [filterMaxSalary, setFilterMaxSalary] = useState<number | string>('');
  const [filterJobType, setFilterJobType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const { roles } = useAuthStore();
  const isEmployerOrAdmin = roles.includes('ROLE_EMPLOYER') || roles.includes('ROLE_ADMIN');

  const fetchJobs = useCallback(async (currentPage = 0) => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (searchTitle || searchLocation || searchCompany) {
        data = await searchJobs(searchTitle, searchLocation, searchCompany, currentPage);
      } else if (filterMinSalary || filterMaxSalary || filterJobType || filterLocation) {
        data = await filterJobs(
          Number(filterMinSalary) || 0,
          Number(filterMaxSalary) || 999999999,
          filterJobType,
          filterLocation,
          currentPage
        );
      } else {
        data = await getAllJobs(currentPage);
      }
      setJobs(data.content);
      setTotalPages(data.totalPages);
      setPage(currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [searchTitle, searchLocation, searchCompany, filterMinSalary, filterMaxSalary, filterJobType, filterLocation]);

  useEffect(() => {
    fetchJobs();
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
        setMessage('Job deleted successfully!');
        fetchJobs(page); // Refresh current page
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Job Listings</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
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

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
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
          <Button type="submit" className="w-full md:w-auto">Filter</Button>
        </form>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {loading && <p className="text-center">Loading jobs...</p>}

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

      <div className="flex justify-between items-center mt-8">
        <Button onClick={() => fetchJobs(page - 1)} disabled={page === 0}>
          Previous
        </Button>
        <span>Page {page + 1} of {totalPages}</span>
        <Button onClick={() => fetchJobs(page + 1)} disabled={page + 1 >= totalPages}>
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
