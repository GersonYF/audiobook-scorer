import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetJobStatusQuery } from '../store/api/jobsApi';
import './JobDetail.css';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Poll every 3 seconds if job is not completed
  const { data, isLoading, error } = useGetJobStatusQuery(id || '', {
    //pollingInterval: 60000 * 60,
    pollingInterval: 5000,
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="job-detail-container">
        <div className="loading-state">Loading job details...</div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="job-detail-container">
        <div className="job-not-found">
          <h1>Job Not Found</h1>
          <p>The requested job could not be found.</p>
          <button onClick={() => navigate('/jobs')} className="back-button">
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const apiJob = data.job;
  const status = apiJob.status.charAt(0).toUpperCase() + apiJob.status.slice(1);

  return (
    <div className="job-detail-container">
      <div className="job-detail-header">
        <button onClick={() => navigate('/jobs')} className="back-button">
          ← Back to Jobs
        </button>
        <h1>Job Details</h1>
      </div>

      <div className="job-detail-content">
        <div className="detail-section">
          <h2>File Information</h2>
          <div className="detail-row">
            <span className="label">File Name:</span>
            <span className="value">{apiJob.input.fileName}</span>
          </div>
          <div className="detail-row">
            <span className="label">Created:</span>
            <span className="value">
              {new Date(apiJob.createdAt).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="detail-row">
            <span className="label">Last Updated:</span>
            <span className="value">
              {new Date(apiJob.updatedAt).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="detail-row">
            <span className="label">Job ID:</span>
            <span className="value">{apiJob.jobId}</span>
          </div>
        </div>

        {apiJob.metadata && (
          <div className="detail-section">
            <h2>Book Information</h2>
            <div className="detail-row">
              <span className="label">Title:</span>
              <span className="value">{apiJob.metadata.title}</span>
            </div>
            <div className="detail-row">
              <span className="label">Author:</span>
              <span className="value">{apiJob.metadata.author}</span>
            </div>
            <div className="detail-row">
              <span className="label">Year:</span>
              <span className="value">{apiJob.metadata.year}</span>
            </div>
            <div className="detail-row">
              <span className="label">Description:</span>
              <span className="value">{apiJob.metadata.description}</span>
            </div>
            {/* <div className="detail-row">
              <span className="label">Genres:</span>
              <span className="value">{apiJob.metadata.genres.join(', ')}</span>
            </div> */}
          </div>
        )}

        <div className="detail-section">
          <h2>Status</h2>
          <div className="status-display">
            <span className={`status-badge-large ${status.toLowerCase().replace(' ', '-')}`}>
              {status}
            </span>
            {status !== 'Completed' && status !== 'Failed' && (
              <span className="polling-indicator">● Live</span>
            )}
          </div>
          
          {status !== 'Completed' && status !== 'Failed' && (
            <div className="progress-section">
              <div className="progress-label">
                <span>Processing: {status}</span>
                <span>{apiJob.progress}%</span>
              </div>
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large" 
                  style={{ width: `${apiJob.progress}%` }}
                />
              </div>
              <p className="progress-message">
                Your audiobook is being analyzed and scored. This page updates automatically every 3 seconds.
              </p>
            </div>
          )}

          {apiJob.error && (
            <div className="error-section">
              <p className="error-message">
                ❌ Error: {apiJob.error}
              </p>
            </div>
          )}

          {status === 'Completed' && apiJob.outputs && (
            <div className="ready-section">
              <p className="ready-message">
                ✓ Your soundtrack is ready!
              </p>
              
              <div className="audio-players">
                <div className="player-section">
                  <h3>Background Music Only</h3>
                  <audio controls className="audio-player">
                    <source src={apiJob.outputs.musicOnlyUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <a 
                    href={apiJob.outputs.musicOnlyUrl} 
                    download 
                    className="download-button"
                  >
                    Download Music Only
                  </a>
                </div>

                <div className="player-section">
                  <h3>Mixed Version (Audio + Music)</h3>
                  <audio controls className="audio-player">
                    <source src={apiJob.outputs.mixedUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <a 
                    href={apiJob.outputs.mixedUrl} 
                    download 
                    className="download-button"
                  >
                    Download Mixed Version
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
