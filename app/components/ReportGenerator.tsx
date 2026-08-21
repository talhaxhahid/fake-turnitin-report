'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ReportGenerator() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
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
    const validTypes = ['application/pdf'];
    const validExtensions = ['.pdf'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      alert('Please upload a PDF file only.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return;
    }

    setSelectedFile(file);
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

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

      let documentPdfBytes: Uint8Array;
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      let extractedText = '';

      if (fileExtension === 'doc' || fileExtension === 'docx') {
        setGenerationProgress(5);
        setGenerationStatus('Converting Word document to PDF...');
        const { convertWordToPdf, extractTextFromWord } = await import('../utils/pdfHelpers');

        const [pdfBytes, text] = await Promise.all([
          convertWordToPdf(selectedFile),
          extractTextFromWord(selectedFile)
        ]);

        documentPdfBytes = pdfBytes;
        extractedText = text;
      } else {
        setGenerationProgress(5);
        setGenerationStatus('Reading PDF document...');
        const arrayBuffer = await selectedFile.arrayBuffer();
        documentPdfBytes = new Uint8Array(arrayBuffer);

        const { extractTextFromPdf } = await import('../utils/pdfHighlighter');
        extractedText = await extractTextFromPdf(documentPdfBytes);
      }

      setGenerationProgress(10);
      setGenerationStatus('Analyzing document content...');

      const wordCount = extractedText.split(/\s+/).filter(Boolean).length || 0;
      const charCount = extractedText.length || 0;
      const fileSize = `${(selectedFile.size / 1024).toFixed(1)} KB`;

      const { getPdfPageCount } = await import('../utils/pdfHelpers');
      const pageCount = await getPdfPageCount(documentPdfBytes);

      const aiPercentageNum = aiReportValue === '*'
        ? Math.floor(Math.random() * 30 + 20)
        : parseInt(aiReportValue);

      const similarityPercentageNum = parseInt(similarityValue) || 0;

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

      const { highlightPdfText: highlightAiText, mergePdfs: mergeAiPdfs } = await import('../utils/pdfHelpers');
      const aiHighlightedPdfBytes = aiPercentageNum > 0
        ? await highlightAiText(documentPdfBytes, aiPercentageNum)
        : documentPdfBytes;

      setGenerationProgress(40);
      setGenerationStatus('Merging AI Report with document...');

      const turnitinMergedPdfBytes = await mergeAiPdfs(turnitinReportPdfBytes, aiHighlightedPdfBytes);

      setGenerationProgress(50);
      setGenerationStatus('Generating Similarity Report...');

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

      const { highlightPdfText: highlightSimilarityText, mergePdfs: mergeSimilarityPdfs } = await import('../utils/similarityPdfHelpers');
      const similarityHighlightedPdfBytes = similarityPercentageNum > 0
        ? await highlightSimilarityText(documentPdfBytes, similarityPercentageNum)
        : documentPdfBytes;

      setGenerationProgress(80);
      setGenerationStatus('Merging Similarity Report with document...');

      const similarityMergedPdfBytes = await mergeSimilarityPdfs(similarityReportPdfBytes, similarityHighlightedPdfBytes);

      setGenerationProgress(95);
      setGenerationStatus('Finalizing reports...');

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

      // Increment the public report counter (fire-and-forget; never blocks UX)
      fetch('/api/stats/increment', { method: 'POST' })
        .then(() => window.dispatchEvent(new Event('reports-counter:bump')))
        .catch(() => { /* offline / network — silent */ });

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
      {/* === Upload Tool === */}
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
          <p className="upload-subtext">or click to browse your files</p>
          <p className="upload-formats">PDF only · Max 10MB</p>

          <input
            id="file-input"
            type="file"
            className="file-input"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
          />
        </div>

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

      {/* === Modal === */}
      {showModal && mounted && createPortal(
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Configure Report Settings</h2>
              <button className="modal-close" onClick={handleCloseModal} aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
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

              {!isGenerating && !generatedFiles && (
                <>
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

            {!isGenerating && !generatedFiles && (
              <div className="modal-footer">
                <button className="modal-btn-submit" onClick={handleSubmit}>
                  Generate Report
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
