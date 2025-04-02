import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllJobs, getAllJobLocations } from '../../services/userService'; // Import new function
import Navbar from '../Navbar/Navbar'; // Import Navbar
import './JobBoard.css';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]); // State for job locations
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [salaryRange, setSalaryRange] = useState([0, 100000]);
  const [industry, setIndustry] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobType, setJobType] = useState('');
  const jobsPerPage = 2;
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    getAllJobs()
      .then((fetchedJobs) => setJobs(fetchedJobs))
      .catch((error) => console.error('Failed to fetch jobs:', error));

    getAllJobLocations()
      .then((fetchedLocations) => setLocations(fetchedLocations))
      .catch((error) => console.error('Failed to fetch job locations:', error));
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSalaryChange = (event) => {
    const value = Number(event.target.value);
    const isMin = event.target.id === 'salary-min';
    setSalaryRange((prevRange) => {
      return isMin ? [value, prevRange[1]] : [prevRange[0], value];
    });
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesTitle = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSalary = job.salary >= salaryRange[0] && job.salary <= salaryRange[1];
      const matchesIndustry = industry ? job.industry === industry : true;
      const matchesLocation = locationFilter ? job.location === locationFilter : true;
      const matchesType = jobType ? job.type === jobType : true;
      return matchesTitle && matchesSalary && matchesIndustry && matchesLocation && matchesType;
    });
  }, [jobs, searchQuery, salaryRange, industry, locationFilter, jobType]); // Dependencies for dynamic updates

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const displayedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when filters change
  }, [filteredJobs]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Navbar onSearchChange={handleSearchChange} /> {/* Pass onSearchChange prop */}
      <div className="job-board-container">
        <div className="left-panel">
          <h2>Filters</h2>
          <div className="filter-section">
            {/* <label htmlFor="salary-min">Minimum Salary:</label>
            <input
              type="range"
              id="salary-min"
              min="0"
              max="200000"
              step="1000"
              value={salaryRange[0]}
              onChange={handleSalaryChange}
            />
            <label htmlFor="salary-max">Maximum Salary:</label> */}
            <input
              type="range"
              id="salary-max"
              min="0"
              max="200000"
              step="1000"
              value={salaryRange[1]}
              onChange={handleSalaryChange}
            />
            <p>
              Salary: ${salaryRange[0]} - ${salaryRange[1]}
            </p>
          </div>
          <div className="filter-section">
            <label htmlFor="industry">Industry:</label>
            <select id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">All</option>
              <option value="Technology">Technology</option> {/* Match the database value */}
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              {/* Add more industries as needed */}
            </select>
          </div>
          <div className="filter-section">
            <label htmlFor="location">Location:</label>
            <select id="location" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="">All</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-section">
            <label htmlFor="job-type">Job Type:</label>
            <select id="job-type" value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="">All</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              {/* Add more job types as needed */}
            </select>
          </div>
        </div>
        <div className="right-panel">
          <h1>Job Board</h1>
          <ul className="job-list">
            {displayedJobs.map((job) => (
              <li className="job-item" key={job.id}>
                <h3>{job.title || 'Unknown Job Title'}</h3>
                <p>{job.company || 'Unknown Company'} • {job.location || 'Unknown Location'}</p>
                <p>Posted {job.postedDate || 'Unknown Date'}</p>
                <p><strong>Description:</strong> {job.description || 'No description available'}</p>
                <p><strong>Salary:</strong> ${job.salary || 'Not specified'}</p>
                <p><strong>Skills Required:</strong> {job.skills?.join(', ') || 'Not specified'}</p>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobBoard;
