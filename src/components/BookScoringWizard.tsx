import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setAudioFile,
  updateBookDetails,
  addGenre,
  removeGenre,
} from "../store/slices/bookSlice";
import {
  useCreateJobMutation,
  useUploadFileMutation,
} from "../store/api/jobsApi";
import "./BookScoringWizard.css";

const BookScoringWizard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { audioFile, bookDetails } = useAppSelector((state) => state.book);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadedFile(file);
    dispatch(
      setAudioFile({
        name: file.name,
        size: file.size,
        type: file.type,
      })
    );
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setUploadedFileUrl(null);
    setUploadedFileName(null);
    setUploadedFileType(null);
    setCurrentStep(1);
    dispatch(setAudioFile(null));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadFile = async () => {
    if (!uploadedFile) return;

    try {
      const result = await uploadFile(uploadedFile).unwrap();
      // API returns { success, file: { fileUrl, fileName, fileType, ... } }
      setUploadedFileUrl(result.file.fileUrl);
      setUploadedFileName(result.file.fileName);
      setUploadedFileType(result.file.fileType);
      setCurrentStep(2);
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert("Failed to upload file. Please try again.");
      handleClearFile();
    }
  };

  const handleCancel = () => {
    navigate("/jobs");
  };

  const handleInputChange = (
    field: keyof typeof bookDetails,
    value: string | number
  ) => {
    dispatch(updateBookDetails({ [field]: value }));
  };

  const handleAddGenre = (genre: string) => {
    if (genre.trim()) {
      dispatch(addGenre(genre.trim()));
    }
  };

  const handleStartScoring = async () => {
    if (!uploadedFileUrl || !uploadedFileName || !uploadedFileType) return;

    try {
      await createJob({
        fileUrl: uploadedFileUrl,
        fileName: uploadedFileName,
        fileType: uploadedFileType,
        title: bookDetails.title || undefined,
        stylePreset: "cinematic",
        mixWithAudiobook: true,
      }).unwrap();

      navigate("/jobs");
    } catch (error) {
      console.error("Failed to create job:", error);
      alert("Failed to create job. Please try again.");
    }
  };

  return (
    <div className="wizard-container">
      <h1>Book Scoring Wizard</h1>

      <div className="wizard-content">
        {/* Left Panel - Audiobook Source */}
        <div className="panel">
          <div className="panel-header">
            <h2>Audiobook source</h2>
            <span className="step-indicator">Step 1 - Upload & detect</span>
          </div>

          <p className="panel-description">
            Upload your audiobook and let AI guess title, year, description, and
            categories before we start composing the soundtrack.
          </p>

          <div
            className={`upload-area ${dragActive ? "drag-active" : ""} ${
              audioFile && !uploadedFileUrl ? "has-file" : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !audioFile && fileInputRef.current?.click()}
            style={{ display: uploadedFileUrl ? "none" : "block" }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {audioFile ? (
              <div className="file-info">
                <p>📁 {audioFile.name}</p>
              </div>
            ) : (
              <p>Click to upload or drag & drop</p>
            )}
          </div>

          {uploadedFileUrl && (
            <div className="upload-success-card">
              <div className="success-header">
                <span className="success-icon">✓</span>
                <h3>File Uploaded Successfully!</h3>
              </div>
              <div className="file-preview">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <p className="file-name">{audioFile?.name}</p>
                  <a
                    href={uploadedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-url"
                  >
                    View uploaded file →
                  </a>
                </div>
              </div>
              <button
                className="clear-file-button-large"
                onClick={handleClearFile}
                type="button"
              >
                Remove & Upload Different File
              </button>
            </div>
          )}

          {audioFile && !uploadedFileUrl && (
            <>
              <button
                className="upload-button"
                onClick={handleUploadFile}
                disabled={isUploading}
                type="button"
              >
                {isUploading ? "Uploading..." : "Upload File"}
              </button>
              <button
                className="clear-file-button-small"
                onClick={handleClearFile}
                type="button"
              >
                Clear
              </button>
            </>
          )}

          <div className="lookup-section">
            <label>Book title or keywords (for AI lookup)</label>
            <input
              type="text"
              placeholder="e.g. The Name of the Wind scifi novel about time tr..."
              className="lookup-input"
            />
            <p className="helper-text">
              We'll use this (or the filename) to ask Gemini / ChatGPT for book
              information. You can edit everything later.
            </p>
            <p className="helper-text">
              We only use this information to enrich your soundtrack metadata.
            </p>
          </div>
        </div>

        {/* Right Panel - Book Details */}
        <div className={`panel ${currentStep === 1 ? "disabled" : ""}`}>
          <div className="panel-header">
            <h2>Book details</h2>
            <span className="step-indicator">Step 2 - Review & confirm</span>
          </div>

          {currentStep === 1 ? (
            <div className="step-locked">
              <p>📤 Upload your file first to continue</p>
            </div>
          ) : (
            <>
              <p className="panel-description">
                We'll use these details to guide mood analysis and to label the
                soundtrack. Adjust anything before we start.
              </p>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={bookDetails.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="AI-guessed Title"
                />
              </div>

              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  value={bookDetails.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="AI-guessed Author"
                />
              </div>

              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={bookDetails.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  placeholder="2014"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={bookDetails.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="A suspenseful mystery following a reluctant hero who uncovers a conspiracy hidden beneath an ancient cry."
                  rows={4}
                />
              </div>

              <div className="genres-section">
                <div className="genre-tags">
                  {bookDetails.genres.map((genre) => (
                    <span key={genre} className="genre-tag">
                      {genre}
                      <button
                        onClick={() => dispatch(removeGenre(genre))}
                        className="remove-genre"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {["Mystery", "Thriller", "Fantasy"].map((genre) => (
                    <span
                      key={genre}
                      className="genre-tag clickable"
                      onClick={() => handleAddGenre(genre)}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="button-group">
                <button
                  className="cancel-button"
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="start-button"
                  onClick={handleStartScoring}
                  disabled={!uploadedFileUrl || isCreating}
                >
                  {isCreating ? "Creating job..." : "Start scoring"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookScoringWizard;
