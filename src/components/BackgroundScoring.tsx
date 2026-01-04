import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setFilter } from '../store/slices/jobsSlice';
import { useGetJobsQuery, type JobsListResponse } from '../store/api/jobsApi';
import { JobFilter } from '../types';
import './BackgroundScoring.css';

const BackgroundScoring: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.jobs);
  
  const { data, isLoading, error, refetch } = useGetJobsQuery(undefined, {
    pollingInterval: 5000,
  });

  const filteredJobs = useMemo(() => {
    if (!data?.jobs) return [];
    
    return data.jobs.filter((job) => {
      if (filter === 'all') return true;
      const status = job.status.toLowerCase();
      return status === filter;
    });
  }, [data?.jobs, filter]);

  const getActionButton = (job: JobsListResponse['jobs'][0]): React.ReactElement => {
    return (
      <button 
        className="action-button view"
        onClick={() => navigate(`/jobs/${job.jobId}`)}
      >
        View
      </button>
    );
  };

  const handleFilterChange = (newFilter: JobFilter) => {
    dispatch(setFilter(newFilter));
  };

  const handleNewJob = () => {
    navigate('/wizard');
  };

  if (isLoading) {
    return (
      <div className="background-scoring-container">
        <div className="loading-state">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="background-scoring-container">
        <div className="error-state">
          <p>Error loading jobs. Please try again.</p>
          <button onClick={() => refetch()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="background-scoring-container">
      <div className="header">
        <div className="header-title">
          <h1>Audiobook Background Scoring</h1>
          <span className="polling-indicator-small">● Live</span>
        </div>
        <button className="new-job-button" onClick={handleNewJob}>
          + New Job
        </button>
      </div>

      {data?.stats && (
        <div className="stats-bar">
          <span>Total: {data.stats.total}</span>
          <span>Queued: {data.stats.queued}</span>
          <span>Processing: {data.stats.transcribing + data.stats.analyzing + data.stats.composing + data.stats.mixing}</span>
          <span>Completed: {data.stats.completed}</span>
          <span>Failed: {data.stats.failed}</span>
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`tab ${filter === 'queued' ? 'active' : ''}`}
          onClick={() => handleFilterChange('queued')}
        >
          Queued
        </button>
        <button
          className={`tab ${filter === 'transcribing' ? 'active' : ''}`}
          onClick={() => handleFilterChange('transcribing')}
        >
          Transcribing
        </button>
        <button
          className={`tab ${filter === 'analyzing' ? 'active' : ''}`}
          onClick={() => handleFilterChange('analyzing')}
        >
          Analyzing
        </button>
        <button
          className={`tab ${filter === 'composing' ? 'active' : ''}`}
          onClick={() => handleFilterChange('composing')}
        >
          Composing
        </button>
        <button
          className={`tab ${filter === 'mixing' ? 'active' : ''}`}
          onClick={() => handleFilterChange('mixing')}
        >
          Mixing
        </button>
        <button
          className={`tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </button>
      </div>

      <div className="jobs-table">
        <div className="table-header">
          <div className="column">File name</div>
          <div className="column">Status</div>
          <div className="column">Progress</div>
          <div className="column">Created</div>
          <div className="column">Actions</div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <p>No jobs found. Click "New Job" to start scoring an audiobook.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.jobId} className="table-row">
              <div className="column file-name">{job.input.fileName}</div>
              <div className="column status">
                <span className={`status-badge ${job.status.toLowerCase().replace(' ', '-')}`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
              <div className="column progress">
                {job.status.toLowerCase() !== 'completed' && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="column created">
                {new Date(job.createdAt).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </div>
              <div className="column actions">
                {getActionButton(job)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BackgroundScoring;