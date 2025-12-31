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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<{
    turnitinPdf: Uint8Array | null;
    turnitinFilename: string;
    similarityPdf: Uint8Array | null;
    similarityFilename: string;
  } | null>(null);

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
    // Validate file type - only PDF allowed
    const validTypes = ['application/pdf'];
    const validExtensions = ['.pdf'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      alert('Please upload a PDF file only.');
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

  const handleDownloadFile = (pdfBytes: Uint8Array, filename: string) => {
    // Create a new ArrayBuffer and copy data to avoid TypeScript issues
    const newBuffer = new ArrayBuffer(pdfBytes.length);
    new Uint8Array(newBuffer).set(pdfBytes);
    const blob = new Blob([newBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      setIsGenerating(true);
      setGenerationProgress(0);
      setGenerationStatus('Preparing document...');

      // Prepare document for merging
      let documentPdfBytes: Uint8Array;
      // Convert Word to PDF if needed (and extract text)
      let fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      let extractedText = '';

      if (fileExtension === 'doc' || fileExtension === 'docx') {
        setGenerationProgress(5);
        setGenerationStatus('Converting Word document to PDF...');
        const { convertWordToPdf, extractTextFromWord } = await import('./utils/pdfHelpers');

        // Parallel execution for speed
        const [pdfBytes, text] = await Promise.all([
          convertWordToPdf(selectedFile),
          extractTextFromWord(selectedFile)
        ]);

        documentPdfBytes = pdfBytes;
        extractedText = text;
      } else {
        // It's already a PDF
        setGenerationProgress(5);
        setGenerationStatus('Reading PDF document...');
        const arrayBuffer = await selectedFile.arrayBuffer();
        documentPdfBytes = new Uint8Array(arrayBuffer);

        // Extract text from PDF for accurate word count
        const { extractTextFromPdf } = await import('./utils/pdfHighlighter');
        extractedText = await extractTextFromPdf(documentPdfBytes);
      }

      setGenerationProgress(10);
      setGenerationStatus('Analyzing document content...');

      // Calculate stats from extracted text
      const wordCount = extractedText.split(/\s+/).filter(Boolean).length || 0;
      const charCount = extractedText.length || 0;
      const fileSize = `${(selectedFile.size / 1024).toFixed(1)} KB`;

      const { getPdfPageCount } = await import('./utils/pdfHelpers');
      const pageCount = await getPdfPageCount(documentPdfBytes);

      // Calculate AI percentage
      const aiPercentageNum = aiReportValue === '*'
        ? Math.floor(Math.random() * 30 + 20)
        : parseInt(aiReportValue);

      // Calculate Similarity percentage
      const similarityPercentageNum = parseInt(similarityValue) || 0;

      // ===== GENERATE TURNITIN PDF (AI REPORT) =====
      setGenerationProgress(20);
      setGenerationStatus('Generating AI Report...');

      const turnitinParams = new URLSearchParams({
        fileName: selectedFile.name,
        reportTitle: 'Originality Report',
        wordCount: wordCount.toString(),
        charCount: charCount.toString(),
        aiPercent: aiPercentageNum.toString(),
        similarityPercent: similarityValue,
        fileSize: fileSize,
        docPages: pageCount.toString(),
      });

      const turnitinResponse = await fetch(`/api/turnitin-pdf?${turnitinParams.toString()}`);
      if (!turnitinResponse.ok) {
        const errorData = await turnitinResponse.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to generate Turnitin report');
      }

      const turnitinReportPdfBytes = new Uint8Array(await turnitinResponse.arrayBuffer());

      setGenerationProgress(30);
      setGenerationStatus('Applying AI highlights to document...');

      // Apply AI highlights using pdfHelpers.ts and pdfHighlighter.ts
      const { highlightPdfText: highlightAiText, mergePdfs: mergeAiPdfs } = await import('./utils/pdfHelpers');
      const aiHighlightedPdfBytes = aiPercentageNum > 0
        ? await highlightAiText(documentPdfBytes, aiPercentageNum)
        : documentPdfBytes;

      setGenerationProgress(40);
      setGenerationStatus('Merging AI Report with document...');

      // Merge Turnitin report with AI-highlighted document
      const turnitinMergedPdfBytes = await mergeAiPdfs(turnitinReportPdfBytes, aiHighlightedPdfBytes);

      setGenerationProgress(50);
      setGenerationStatus('Generating Similarity Report...');

      // ===== GENERATE SIMILARITY PDF (SIMILARITY REPORT) =====
      const similarityParams = new URLSearchParams({
        fileName: selectedFile.name,
        reportTitle: 'Similarity Report',
        wordCount: wordCount.toString(),
        charCount: charCount.toString(),
        aiPercent: aiPercentageNum.toString(),
        similarityPercent: similarityPercentageNum.toString(),
        fileSize: fileSize,
        docPages: pageCount.toString(),
      });

      const similarityResponse = await fetch(`/api/similarity-pdf?${similarityParams.toString()}`);
      if (!similarityResponse.ok) {
        const errorData = await similarityResponse.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to generate Similarity report');
      }

      const similarityReportPdfBytes = new Uint8Array(await similarityResponse.arrayBuffer());

      setGenerationProgress(65);
      setGenerationStatus('Applying similarity highlights to document...');

      // Apply Similarity highlights using similarityPdfHelpers.ts and similarityPdfHighlighter.ts
      const { highlightPdfText: highlightSimilarityText, mergePdfs: mergeSimilarityPdfs } = await import('./utils/similarityPdfHelpers');
      const similarityHighlightedPdfBytes = similarityPercentageNum > 0
        ? await highlightSimilarityText(documentPdfBytes, similarityPercentageNum)
        : documentPdfBytes;

      setGenerationProgress(80);
      setGenerationStatus('Merging Similarity Report with document...');

      // Merge Similarity report with similarity-highlighted document
      const similarityMergedPdfBytes = await mergeSimilarityPdfs(similarityReportPdfBytes, similarityHighlightedPdfBytes);

      setGenerationProgress(95);
      setGenerationStatus('Finalizing reports...');

      // Store generated files for download buttons
      const baseFilename = selectedFile.name.replace(/\.[^.]+$/, '');
      
      setGeneratedFiles({
        turnitinPdf: turnitinMergedPdfBytes,
        turnitinFilename: `turnitin_ai_${baseFilename}.pdf`,
        similarityPdf: similarityMergedPdfBytes,
        similarityFilename: `similarity_${baseFilename}.pdf`,
      });

      setGenerationProgress(100);
      setGenerationStatus('Reports ready for download!');
      setIsGenerating(false);

    } catch (error) {
      console.error('Error generating report:', error);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      alert(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStatus('');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAiReportValue('0');
    setSimilarityValue('0');
    setIsGenerating(false);
    setGenerationProgress(0);
    setGenerationStatus('');
    setGeneratedFiles(null);
  };

  const handleSimilarityChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setSimilarityValue(value);
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
                <p className="upload-formats">Supports PDF only (Max: 10MB)</p>

                <input
                  id="file-input"
                  type="file"
                  className="file-input"
                  accept=".pdf,application/pdf"
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
              {/* Show progress indicator when generating */}
              {isGenerating && (
                <div className="generation-progress-container">
                  <div className="generation-progress-header">
                    <span className="generation-progress-label">Generating Reports...</span>
                    <span className="generation-progress-percentage">{generationProgress}%</span>
                  </div>
                  <div className="generation-progress-bar">
                    <div
                      className="generation-progress-fill"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  <div className="generation-progress-status">
                    {generationStatus}
                  </div>
                </div>
              )}

              {/* Show download buttons when files are ready */}
              {generatedFiles && !isGenerating && (
                <div className="download-section">
                  <div className="download-success-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="download-title">Reports Ready!</h3>
                  <p className="download-subtitle">Your reports have been generated successfully.</p>
                  <div className="download-buttons">
                    <button
                      className="download-btn download-btn-ai"
                      onClick={() => generatedFiles.turnitinPdf && handleDownloadFile(generatedFiles.turnitinPdf, generatedFiles.turnitinFilename)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download AI Report
                    </button>
                    <button
                      className="download-btn download-btn-similarity"
                      onClick={() => generatedFiles.similarityPdf && handleDownloadFile(generatedFiles.similarityPdf, generatedFiles.similarityFilename)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Similarity Report
                    </button>
                  </div>
                  <button className="generate-new-btn" onClick={handleCloseModal}>
                    Generate New Reports
                  </button>
                </div>
              )}

              {/* Show settings form when not generating and no files ready */}
              {!isGenerating && !generatedFiles && (
                <>
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
                </>
              )}
            </div>

            {/* Show Generate button only when not generating and no files ready */}
            {!isGenerating && !generatedFiles && (
              <div className="modal-footer">
                <button className="modal-btn-submit" onClick={handleSubmit}>
                  Generate Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
