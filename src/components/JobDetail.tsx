import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetJobStatusQuery, useGetJobSegmentsQuery } from '../store/api/jobsApi';
import './JobDetail.css';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'transcription' | 'segments' | 'results'>('transcription');
  
  // Poll every 3 seconds if job is not completed
  const { data, isLoading, error } = useGetJobStatusQuery(id || '', {
    pollingInterval: 60000,
    skip: !id,
  });

  // Fetch segments when job is completed
  const { data: segmentsData, isLoading: segmentsLoading } = useGetJobSegmentsQuery(id || '', {
    skip: !id || ['Mixing', 'Completed'].includes(data?.job?.status || ''),
  });

  // Update active tab when status changes to completed
  React.useEffect(() => {
    if (data?.job?.status) {
      const status = data.job.status.charAt(0).toUpperCase() + data.job.status.slice(1);
      if (status === 'Completed' && activeTab === 'transcription') {
        setActiveTab('results');
      }
    }
  }, [data?.job?.status, activeTab]);

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
        {/* Left Column */}
        <div className="left-column">
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
              <div className="detail-row">
                <span className="label">Genre:</span>
                <span className="value">{apiJob.metadata.genre}</span>
              </div>
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
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="detail-section">
            <div className="tabs-container">
              <div className="tabs-header">
                <button
                  className={`tab-button ${activeTab === 'transcription' ? 'active' : ''}`}
                  onClick={() => setActiveTab('transcription')}
                >
                  📝 Transcription
                </button>
                <button
                  className={`tab-button ${activeTab === 'segments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('segments')}
                >
                  🎼 Music Segments
                </button>
                <button
                  className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
                  onClick={() => setActiveTab('results')}
                >
                  🎵 Results
                </button>
              </div>

              <div className="tabs-content">
                {/* Transcription Tab */}
                {activeTab === 'transcription' && (
                  <div className="tab-panel">
                    <h3>Full Transcription</h3>
                    <div className="transcription-content">
                      {segmentsData?.segments.map((segment, index) => (
                        <div key={segment.segmentId} className="transcription-segment">
                          <span className="transcription-time">[{formatTime(segment.start)}]</span>
                          <p className="transcription-text">{segment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Music Segments Tab */}
                {activeTab === 'segments' && (
                  <div className="tab-panel">
                    <div className="segments-section-header">
                      <h3>Music Segments ({segmentsData?.totalSegments || 0})</h3>
                    </div>

                    {segmentsLoading ? (
                      <p>Loading segments...</p>
                    ) : segmentsData ? (
                      <div className="waveform-view">
                        {/* Waveform Visualization */}
                        <div className="waveform-container">
                          <div className="waveform-header">
                            <div className="waveform-title">🎵 Audiobook Waveform</div>
                            <div className="waveform-legend">
                              <span className="legend-item">Height = Duration</span>
                              <span className="legend-item">Brightness = Intensity</span>
                            </div>
                          </div>
                          <div className="waveform-bars" onClick={(e) => {
                            if (e.target === e.currentTarget) {
                              setSelectedSegment(null);
                            }
                          }}>
                            {segmentsData.segments.map((segment, index) => {
                              const maxDuration = Math.max(...segmentsData.segments.map(s => s.duration));
                              const heightPercent = (segment.duration / maxDuration) * 100;
                              const color = getMoodColor(segment.mood, segment.intensity);
                              
                              return (
                                <div
                                  key={segment.segmentId}
                                  className={`waveform-bar ${selectedSegment === index ? 'selected' : ''}`}
                                  style={{
                                    height: `${heightPercent}%`,
                                    backgroundColor: color,
                                  }}
                                  onClick={() => {
                                    if (selectedSegment === index) {
                                      setSelectedSegment(null);
                                    } else {
                                      setSelectedSegment(index);
                                      const element = document.getElementById(`segment-detail-${index}`);
                                      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                  }}
                                  title={`Segment ${index + 1}: ${segment.mood} (${segment.intensity}/10) - ${formatTime(segment.duration)}`}
                                >
                                  <span className="bar-number">{index + 1}</span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="waveform-timeline">
                            {segmentsData.segments.map((segment, index) => (
                              index % 5 === 0 && (
                                <div key={index} className="timeline-marker" style={{ left: `${(index / segmentsData.segments.length) * 100}%` }}>
                                  {formatTime(segment.start)}
                                </div>
                              )
                            ))}
                          </div>
                        </div>

                        {/* Segment Details */}
                        <div className="segment-details-list">
                          <h3>Segment Details</h3>
                          {segmentsData.segments.map((segment, index) => {
                            const moodColor = getMoodColor(segment.mood, segment.intensity);
                            
                            return (
                            <div 
                              key={segment.segmentId} 
                              id={`segment-detail-${index}`}
                              className={`segment-detail-card ${selectedSegment === index ? 'highlighted' : ''}`}
                              onClick={() => setSelectedSegment(index)}
                            >
                              <div className="timeline-time-badge">
                                <span className="timeline-start">{formatTime(segment.start)}</span>
                                <span className="timeline-arrow">→</span>
                                <span className="timeline-end">{formatTime(segment.end)}</span>
                                <span className="timeline-duration">({formatTime(segment.duration)})</span>
                              </div>
                              <div className="timeline-card">
                                <div className="timeline-card-header">
                                  <span className="timeline-segment-number">Segment {index + 1}</span>
                                  <div className="timeline-tags">
                                    <span 
                                      className="timeline-tag mood" 
                                      style={{ backgroundColor: moodColor, color: '#fff', fontWeight: 600 }}
                                    >
                                      {segment.mood}
                                    </span>
                                    <span className="timeline-tag intensity">{segment.intensity}/10</span>
                                  </div>
                                </div>
                                <p className="timeline-text">{segment.text}</p>
                                {segment.musicalSuggestions && (
                                  <div className="timeline-suggestions">
                                    {segment.musicalSuggestions.genre && (
                                      <span className="timeline-suggestion">🎵 {segment.musicalSuggestions.genre}</span>
                                    )}
                                    {segment.musicalSuggestions.tempo && (
                                      <span className="timeline-suggestion">🎼 {segment.musicalSuggestions.tempo}</span>
                                    )}
                                    {segment.musicalSuggestions.dynamics && (
                                      <span className="timeline-suggestion">📊 {segment.musicalSuggestions.dynamics}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )})}
                        </div>
                      </div>
                    ) : (
                      <p>No segments data available.</p>
                    )}
                  </div>
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                  <div className="tab-panel">
                    {status === 'Completed' && apiJob.outputs ? (
                      <>
                        <h3>Your Soundtrack is Ready!</h3>
                        <div className="audio-players">
                          <div className="player-section">
                            <h4>Background Music Only</h4>
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
                            <h4>Mixed Version (Audio + Music)</h4>
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
                      </>
                    ) : (
                      <div className="not-ready-message">
                        <div className="not-ready-icon">⏳</div>
                        <h3>Your Files Are Not Ready Yet</h3>
                        <p>We're still processing your audiobook. Your soundtrack will be available here once processing is complete.</p>
                        <div className="status-info">
                          <span className="status-label">Current Status:</span>
                          <span className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}>
                            {status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time in seconds to MM:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Helper function to get color based on mood and intensity
const getMoodColor = (mood: string, intensity: number): string => {
  // Base colors for different moods
  const moodColors: { [key: string]: { base: string; hsl: { h: number; s: number; l: number } } } = {
    'happy': { base: '#FFD700', hsl: { h: 51, s: 100, l: 50 } },
    'joyful': { base: '#FFD700', hsl: { h: 51, s: 100, l: 50 } },
    'excited': { base: '#FF6B6B', hsl: { h: 0, s: 100, l: 70 } },
    'tense': { base: '#FF4757', hsl: { h: 354, s: 100, l: 63 } },
    'suspenseful': { base: '#5F27CD', hsl: { h: 258, s: 68, l: 48 } },
    'mysterious': { base: '#341F97', hsl: { h: 250, s: 67, l: 36 } },
    'sad': { base: '#3742FA', hsl: { h: 235, s: 95, l: 61 } },
    'melancholic': { base: '#5352ED', hsl: { h: 241, s: 82, l: 62 } },
    'calm': { base: '#2ED573', hsl: { h: 145, s: 73, l: 51 } },
    'peaceful': { base: '#1DD1A1', hsl: { h: 166, s: 77, l: 47 } },
    'relaxed': { base: '#48DBFB', hsl: { h: 190, s: 95, l: 64 } },
    'romantic': { base: '#FF6348', hsl: { h: 8, s: 100, l: 64 } },
    'dramatic': { base: '#8B0000', hsl: { h: 0, s: 100, l: 27 } },
    'hopeful': { base: '#FFA502', hsl: { h: 38, s: 100, l: 51 } },
    'inspirational': { base: '#FF7F50', hsl: { h: 16, s: 100, l: 66 } },
    'dark': { base: '#2C3E50', hsl: { h: 210, s: 29, l: 24 } },
    'ominous': { base: '#34495E', hsl: { h: 210, s: 29, l: 29 } },
  };

  // Get the mood color or default to a neutral color
  const moodData = moodColors[mood.toLowerCase()] || { base: '#95A5A6', hsl: { h: 184, s: 6, l: 61 } };
  
  // Adjust lightness based on intensity (higher intensity = brighter/more saturated)
  // Intensity goes from 1-10, we'll map it to lightness variation
  const intensityFactor = intensity / 10;
  
  // For darker moods, increase lightness with intensity
  // For lighter moods, increase saturation with intensity
  const adjustedL = moodData.hsl.l + (intensityFactor * 20 - 10); // Range: -10 to +10
  const adjustedS = Math.min(100, moodData.hsl.s + (intensityFactor * 30)); // Increase saturation
  
  return `hsl(${moodData.hsl.h}, ${adjustedS}%, ${adjustedL}%)`;
};

export default JobDetail;
