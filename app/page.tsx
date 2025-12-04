'use client';

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [aiReportValue, setAiReportValue] = useState<string>('0');
  const [similarityValue, setSimilarityValue] = useState<string>('0');
  const [reportTitle, setReportTitle] = useState<string>('');

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      alert('Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return;
    }

    setSelectedFile(file);
    simulateUpload(file);
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowModal(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleUploadClick = () => {
    document.getElementById('file-input')?.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Prepare document for merging
      let documentPdfBytes: Uint8Array;
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      // Convert Word to PDF if needed
      if (fileExtension === 'doc' || fileExtension === 'docx') {
        setUploadProgress(20);
        const { convertWordToPdf } = await import('./utils/pdfHelpers');
        documentPdfBytes = await convertWordToPdf(selectedFile);
      } else {
        // It's already a PDF
        setUploadProgress(20);
        const arrayBuffer = await selectedFile.arrayBuffer();
        documentPdfBytes = new Uint8Array(arrayBuffer);
      }

      setUploadProgress(40);

      // Calculate file metadata
      const arrayBuffer = await selectedFile.arrayBuffer();
      const text = await selectedFile.text().catch(() => '');
      const wordCount = text.split(/\s+/).filter(Boolean).length || 4125;
      const charCount = text.length || 25069;
      const fileSize = `${(selectedFile.size / 1024).toFixed(1)} KB`;

      // Generate Turnitin report PDF
      const params = new URLSearchParams({
        fileName: selectedFile.name,
        reportTitle: reportTitle || 'Originality Report',
        wordCount: wordCount.toString(),
        charCount: charCount.toString(),
        aiPercent: aiReportValue === '*' ? Math.floor(Math.random() * 30 + 20).toString() : aiReportValue,
        similarityPercent: similarityValue,
        fileSize: fileSize,
        docPages: '1', // We don't have easy access to page count
      });

      setUploadProgress(60);

      const response = await fetch(`/api/turnitin-pdf?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to generate Turnitin report');
      }

      const turnitinPdfBytes = new Uint8Array(await response.arrayBuffer());

      setUploadProgress(70);

      // Apply highlights based on AI percentage
      const aiPercentageNum = aiReportValue === '*'
        ? Math.floor(Math.random() * 30 + 20)
        : parseInt(aiReportValue);

      const { highlightPdfText, mergePdfs, downloadFile } = await import('./utils/pdfHelpers');
      const highlightedPdfBytes = aiPercentageNum > 0
        ? await highlightPdfText(documentPdfBytes, aiPercentageNum)
        : documentPdfBytes;

      setUploadProgress(85);

      // Merge PDFs (Turnitin report first, then highlighted document)
      const mergedPdfBytes = await mergePdfs(turnitinPdfBytes, highlightedPdfBytes);

      setUploadProgress(90);

      // Download the merged PDF
      const outputFilename = `turnitin_${selectedFile.name.replace(/\.[^.]+$/, '')}.pdf`;
      downloadFile(mergedPdfBytes, outputFilename);

      setUploadProgress(100);

      // Show success message
      alert('Report generated and downloaded successfully!');

      // Reset and close modal
      setTimeout(() => {
        setShowModal(false);
        setAiReportValue('0');
        setSimilarityValue('0');
        setReportTitle('');
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating report:', error);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      alert(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAiReportValue('0');
    setSimilarityValue('0');
    setReportTitle('');
  };

  const handleSimilarityChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setSimilarityValue(value);
      if (numValue === 0) {
        setReportTitle('');
      }
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <Image
            src="/images/Turnitin_logo.png"
            alt="Turnitin"
            width={120}
            height={32}
            className="logo"
            priority
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {/* Hero Section */}
          <div className="hero">
            <h1 className="hero-title">Turnitin Report Generator</h1>
            <p className="hero-subtitle">
              Generate professional similarity reports for your documents in seconds
            </p>

            {/* Upload Area */}
            <div className="upload-container">
              <div
                className={`upload-area ${isDragging ? 'drag-over' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleUploadClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleUploadClick();
                  }
                }}
              >
                {/* Upload Icon */}
                <svg
                  className="upload-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>

                <p className="upload-text">
                  {selectedFile ? selectedFile.name : 'Drop your document here'}
                </p>
                <p className="upload-subtext">or click to browse</p>
                <p className="upload-formats">Supports PDF, DOC, DOCX (Max: 10MB)</p>

                <input
                  id="file-input"
                  type="file"
                  className="file-input"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="upload-progress-container">
                  <div className="upload-progress-header">
                    <span className="upload-progress-label">Uploading...</span>
                    <span className="upload-progress-percentage">{uploadProgress}%</span>
                  </div>
                  <div className="upload-progress-bar">
                    <div
                      className="upload-progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="upload-progress-text">
                    {selectedFile && (
                      <span>{((selectedFile.size * uploadProgress) / 100 / 1024).toFixed(0)} KB / {(selectedFile.size / 1024).toFixed(0)} KB</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="cta-container">
              <a
                href="https://www.buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta"
              >
                <svg
                  className="btn-icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.615-.336.069-.316.381-.284.676l.057.498c.06.57.12 1.14.184 1.71l.121 1.16.495 4.761.663 6.382c.068.654.134 1.309.28 1.947.184.811.768 1.427 1.581 1.611 1.06.24 2.16.292 3.248.292 1.121 0 2.244-.048 3.358-.245.926-.164 1.695-.81 1.86-1.739.134-.759.16-1.534.222-2.304l.726-8.762c.007-.09.015-.18.028-.27.021-.14.06-.28.127-.405.159-.3.485-.438.81-.415.49.03.974.098 1.458.195.672.134 1.32.356 1.942.64.282.129.568.266.777.5.243.27.362.614.406.98.03.248.008.498.008.747 0 .08-.009.16-.014.239a9.494 9.494 0 01-.298 1.903c-.11.37-.263.722-.465 1.053-.258.423-.61.77-1.036 1.02a4.952 4.952 0 01-1.477.596c-.598.12-1.207.138-1.818.138H9.545c-.285 0-.57-.006-.854-.027-.45-.034-.888-.16-1.29-.38-.377-.207-.7-.507-.934-.877-.235-.373-.38-.79-.44-1.225-.059-.435-.052-.877-.017-1.317.027-.334.065-.667.117-1 .026-.166.061-.331.1-.496.026-.11.066-.217.1-.326.035-.11.087-.208.18-.274.092-.066.214-.084.326-.084h.005a.47.47 0 01.527.472c0 .04-.004.08-.01.12a6.632 6.632 0 00-.116.98c-.037.452-.033.905.026 1.355.061.463.178.913.378 1.334.202.424.485.797.858 1.062.363.258.779.416 1.215.492.29.051.583.069.876.072.31.003.62.009.93.009h6.19c.66 0 1.316-.016 1.973-.152a5.896 5.896 0 001.804-.73c.496-.305.927-.707 1.26-1.186.333-.478.573-1.01.72-1.574.146-.56.214-1.137.214-1.717 0-.257-.012-.514-.04-.769-.062-.577-.289-1.112-.732-1.503-.43-.381-.968-.629-1.53-.798a12.325 12.325 0 00-1.946-.473c-.328-.048-.66-.068-.99-.068-.198 0-.396.01-.594.03-.4.04-.802.124-1.178.26-.376.137-.736.334-1.034.61-.297.274-.54.61-.686.99-.145.38-.198.792-.198 1.202 0 .412.06.822.178 1.215.118.393.294.764.526 1.093.23.33.516.619.847.857.33.238.703.425 1.096.548.393.123.802.18 1.213.18.41 0 .82-.055 1.213-.167.393-.112.766-.282 1.096-.511.33-.23.616-.516.846-.846.23-.33.405-.7.523-1.092.118-.393.178-.803.178-1.215 0-.263-.018-.525-.054-.785-.036-.26-.09-.518-.164-.77-.148-.507-.404-.974-.748-1.368-.343-.394-.774-.712-1.26-.932a4.952 4.952 0 00-1.664-.413 5.896 5.896 0 00-1.804.15c-.578.132-1.136.355-1.642.664-.507.31-.957.7-1.334 1.162-.376.462-.67.986-.877 1.555-.207.57-.318 1.175-.318 1.792v.067c0 .617.111 1.223.318 1.792.207.57.501 1.093.877 1.555.377.462.827.853 1.334 1.162.506.31 1.064.532 1.642.664a5.896 5.896 0 001.804.15c.555-.043 1.1-.158 1.619-.357.518-.198 1.006-.478 1.437-.838.431-.36.8-.797 1.082-1.302.283-.505.476-1.066.568-1.662.092-.596.082-1.21-.043-1.804-.125-.595-.36-1.162-.718-1.66-.358-.497-.824-.922-1.37-1.237a5.896 5.896 0 00-1.804-.73c-.66-.136-1.316-.152-1.973-.152h-.005" />
                </svg>
                Buy Me a Coffee
              </a>
            </div>

            <p className="helper-text">Upload your document to get started</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} Report Generator. For educational purposes only.</p>
            <div className="report-counter">
              <span className="counter-label">Total Reports Generated:</span>
              <span className="counter-value">0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Configuration Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Configure Report Settings</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {/* AI Report Section */}
              <div className="modal-section">
                <label className="modal-label">
                  <span className="label-icon">🤖</span>
                  AI Report Percentage
                </label>
                <select
                  className="modal-select"
                  value={aiReportValue}
                  onChange={(e) => setAiReportValue(e.target.value)}
                >
                  <option value="0">0%</option>
                  <option value="*">* (Random)</option>
                  <option value="30">30%</option>
                  <option value="40">40%</option>
                  <option value="50">50%</option>
                  <option value="60">60%</option>
                  <option value="70">70%</option>
                  <option value="80">80%</option>
                  <option value="90">90%</option>
                  <option value="100">100%</option>
                </select>
              </div>

              {/* Similarity Report Section */}
              <div className="modal-section">
                <label className="modal-label">
                  <span className="label-icon">📊</span>
                  Similarity Report Percentage
                </label>
                <input
                  type="number"
                  className="modal-input"
                  min="0"
                  max="100"
                  value={similarityValue}
                  onChange={(e) => handleSimilarityChange(e.target.value)}
                  placeholder="Enter value (0-100)"
                />
              </div>

              {/* Report Title (Conditional) */}
              {parseInt(similarityValue) > 0 && (
                <div className="modal-section modal-section-fade-in">
                  <label className="modal-label">
                    <span className="label-icon">📝</span>
                    Report Title
                  </label>
                  <input
                    type="text"
                    className="modal-input"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Enter report title"
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="modal-btn-submit" onClick={handleSubmit}>
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
