import React from 'react';
import './JobBoard.css';

const JobBoard = () => {
  const jobs = [
    {
      title: 'Senior Product Designer',
      company: 'Google',
      location: 'San Francisco, CA',
      type: 'Full-time',
      mode: 'Remote',
      salary: '$120k - $180k',
    },
    {
      title: 'Frontend Developer',
      company: 'Microsoft',
      location: 'Seattle, WA',
      type: 'Full-time',
      mode: 'Hybrid',
      salary: '$90k - $140k',
    },
    {
      title: 'iOS Developer',
      company: 'Apple',
      location: 'Cupertino, CA',
      type: 'Full-time',
      mode: 'On-site',
      salary: '$140k - $200k',
    },
  ];

  return (
    <div className="job-board">
      <div className="filters">
        <h3>Filters</h3>
        <div>
          <h4>Experience Level</h4>
          <label><input type="checkbox" /> Entry Level</label>
          <label><input type="checkbox" /> Mid Level</label>
          <label><input type="checkbox" /> Senior Level</label>
        </div>
        <div>
          <h4>Job Type</h4>
          <label><input type="checkbox" /> Full-time</label>
          <label><input type="checkbox" /> Part-time</label>
          <label><input type="checkbox" /> Contract</label>
          <label><input type="checkbox" /> Internship</label>
        </div>
        <div>
          <h4>Salary Range</h4>
          <label><input type="checkbox" /> $0 - $50k</label>
          <label><input type="checkbox" /> $50k - $100k</label>
          <label><input type="checkbox" /> $100k - $150k</label>
          <label><input type="checkbox" /> $150k+</label>
        </div>
      </div>
      <div className="job-list">
        {jobs.map((job, index) => (
          <div key={index} className="job-card">
            <div className="job-header">
              <h4>{job.title}</h4>
              <span>{job.company} • {job.location}</span>
            </div>
            <div className="job-details">
              <span className="job-type">{job.type}</span>
              <span className={`job-mode ${job.mode.toLowerCase()}`}>{job.mode}</span>
              <span className="job-salary">{job.salary}</span>
            </div>
            <button className="apply-button">Apply Now</button>
          </div>
        ))}
        <button className="load-more">Load More Jobs</button>
      </div>
    </div>
  );
};

export default JobBoard;
