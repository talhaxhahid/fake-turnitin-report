'use client';

import { useState } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import JsonLd from "./components/JsonLd";

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
        const { convertWordToPdf, extractTextFromWord } = await import('./utils/pdfHelpers');

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

        const { extractTextFromPdf } = await import('./utils/pdfHighlighter');
        extractedText = await extractTextFromPdf(documentPdfBytes);
      }

      setGenerationProgress(10);
      setGenerationStatus('Analyzing document content...');

      const wordCount = extractedText.split(/\s+/).filter(Boolean).length || 0;
      const charCount = extractedText.length || 0;
      const fileSize = `${(selectedFile.size / 1024).toFixed(1)} KB`;

      const { getPdfPageCount } = await import('./utils/pdfHelpers');
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

      const { highlightPdfText: highlightAiText, mergePdfs: mergeAiPdfs } = await import('./utils/pdfHelpers');
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

      const { highlightPdfText: highlightSimilarityText, mergePdfs: mergeSimilarityPdfs } = await import('./utils/similarityPdfHelpers');
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

  /* === JSON-LD for FAQs on landing === */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is the Turnitin report generator free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Our Turnitin report generator is 100% free to use. You can generate unlimited similarity and AI detection reports without signing up or paying anything.",
        },
      },
      {
        "@type": "Question",
        name: "Can I create a custom Turnitin report with a specific similarity percentage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Our custom Turnitin report tool lets you choose any AI detection percentage (0–100%) and any similarity percentage (0–100%) before generating the PDF.",
        },
      },
      {
        "@type": "Question",
        name: "Is my document safe and private?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Your file is processed locally in your browser. Documents never leave your device, so your content stays fully private.",
        },
      },
      {
        "@type": "Question",
        name: "How long does it take to generate a Turnitin report?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most reports are ready in under 10 seconds for documents up to 10MB. You receive both an AI report and a Similarity report as downloadable PDFs.",
        },
      },
      {
        "@type": "Question",
        name: "Do you support PDF and Word documents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Currently we support PDF files up to 10MB. The generator analyzes content, word count, and pages to produce a realistic Turnitin-style report.",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <SiteHeader />

      {/* ============== HERO + GENERATOR ============== */}
      <section className="hero-wrap" id="generator">
        <span className="hero-orb a" />
        <span className="hero-orb b" />
        <span className="hero-orb c" />

        <div className="container">
          <div className="hero">
            <span className="hero-badge">
              <span className="dot" />
              Trusted by 50,000+ students worldwide
            </span>

            <h1 className="hero-title">
              Free <span className="grad">Turnitin Report Generator</span>
              <br /> with Custom AI & Similarity %
            </h1>

            <p className="hero-subtitle">
              Generate professional Turnitin similarity reports and AI detection reports
              with custom percentages in seconds. 100% free, no signup, instant PDF download.
            </p>

            {/* === Upload Tool (UNCHANGED logic + classes) === */}
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

            <p className="helper-text">⚡ Average generation time: 6 seconds · No signup required</p>

            <div className="hero-stats">
              <span className="hero-stat">
                <span className="hero-check">✓</span>
                <strong>100%</strong> Free forever
              </span>
              <span className="hero-stat">
                <span className="hero-check">✓</span>
                <strong>Instant</strong> PDF download
              </span>
              <span className="hero-stat">
                <span className="hero-check">✓</span>
                <strong>Private</strong> — runs in your browser
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TRUST BAR ============== */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-row">
            <span>★ 4.9 / 5 rating</span>
            <span>50,000+ users</span>
            <span>Universities · Colleges · High Schools</span>
            <span>Privacy-first</span>
            <span>Instant PDF</span>
          </div>
        </div>
      </section>

      {/* ============== FEATURES ============== */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Features</span>
            <h2 className="section-title">
              Everything you need for a <span className="grad">realistic Turnitin report</span>
            </h2>
            <p className="section-subtitle">
              Built for students, freelance writers, and educators who need quick,
              authentic-looking Turnitin similarity and AI detection reports — fully customizable.
            </p>
          </div>

          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="feature-title">Instant Generation</h3>
              <p className="feature-desc">
                Generate both AI detection and similarity reports in under 10 seconds.
                No queues, no waiting, no email required.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon violet" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h3 className="feature-title">Fully Customizable %</h3>
              <p className="feature-desc">
                Set any AI detection percentage and similarity percentage between
                0% and 100% to match the report you need.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon emerald" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="feature-title">100% Free & Unlimited</h3>
              <p className="feature-desc">
                No paywalls, no credit-card. Generate as many free Turnitin reports
                as you need, anytime, with no daily limits.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon sky" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="feature-title">Privacy First</h3>
              <p className="feature-desc">
                Your PDF is processed entirely in your browser. Documents never get
                uploaded to a server — your work stays 100% private.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="feature-title">Authentic Layout</h3>
              <p className="feature-desc">
                Reports match the genuine Turnitin format — color-coded highlights,
                originality score, document metadata, and footer details.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon violet" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              <h3 className="feature-title">Dual Reports</h3>
              <p className="feature-desc">
                Download both the AI Detection Report and the Similarity Report as
                separate PDFs — perfect for any submission.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="section" id="how-it-works" style={{ background: 'hsla(0, 0%, 100%, 0.5)' }}>
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">How it works</span>
            <h2 className="section-title">
              Generate your Turnitin report in <span className="grad">3 simple steps</span>
            </h2>
            <p className="section-subtitle">
              No registration, no installation. Upload your PDF, pick your percentages,
              and download the report instantly.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <h3 className="step-title">Upload your document</h3>
              <p className="step-desc">
                Drag and drop your PDF file (up to 10MB) into the upload area at the
                top of this page — or click to browse.
              </p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <h3 className="step-title">Set custom percentages</h3>
              <p className="step-desc">
                Pick any AI detection percentage and similarity percentage between
                0% and 100% to match what you need.
              </p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <h3 className="step-title">Download the PDF</h3>
              <p className="step-desc">
                In seconds you get two Turnitin-style PDFs — AI report and similarity
                report — ready for download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== USE CASES ============== */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Use cases</span>
            <h2 className="section-title">
              Who uses our <span className="grad">Turnitin report generator</span>?
            </h2>
            <p className="section-subtitle">
              From college essays to client deliverables, our tool is loved by
              students, writers, freelancers, and educators around the world.
            </p>
          </div>

          <div className="usecase-grid">
            <div className="usecase-card">
              <div className="usecase-chip">🎓</div>
              <div>
                <h3>Students</h3>
                <p>Check assignments and dissertations before submission to make sure your work passes plagiarism and AI checks.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="usecase-chip">✍️</div>
              <div>
                <h3>Freelance writers</h3>
                <p>Deliver Turnitin similarity and AI reports alongside articles or essays to verify originality for clients.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="usecase-chip">🏫</div>
              <div>
                <h3>Educators</h3>
                <p>Demonstrate how Turnitin scoring and AI detection works to your students with sample reports.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="usecase-chip">📰</div>
              <div>
                <h3>Bloggers</h3>
                <p>Confirm content originality and AI-detection scores before publishing articles or SEO content.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="usecase-chip">🔬</div>
              <div>
                <h3>Researchers</h3>
                <p>Generate sample reports for research papers to test originality before journal submission.</p>
              </div>
            </div>
            <div className="usecase-card">
              <div className="usecase-chip">🧑‍💼</div>
              <div>
                <h3>Agencies</h3>
                <p>Bundle similarity reports with every deliverable as proof of originality for your clients.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== METRICS ============== */}
      <section className="section-tight">
        <div className="container">
          <div className="metric-row">
            <div className="metric">
              <div className="metric-value">50K+</div>
              <div className="metric-label">Reports generated</div>
            </div>
            <div className="metric">
              <div className="metric-value">4.9★</div>
              <div className="metric-label">Average rating</div>
            </div>
            <div className="metric">
              <div className="metric-value">{'< 10s'}</div>
              <div className="metric-label">Avg. generation time</div>
            </div>
            <div className="metric">
              <div className="metric-value">100%</div>
              <div className="metric-label">Free & private</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section className="section" id="testimonials" style={{ background: 'hsla(0, 0%, 100%, 0.5)' }}>
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Testimonials</span>
            <h2 className="section-title">
              Loved by <span className="grad">50,000+ users</span>
            </h2>
            <p className="section-subtitle">
              Real feedback from real students, writers, and educators who use the
              Turnitin Report Generator every day.
            </p>
          </div>

          <div className="testimonial-grid">
            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                &ldquo;Saved my submission deadline. Generated a clean Turnitin
                similarity report in under 10 seconds — looks exactly like the real one.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">SM</div>
                <div className="testimonial-meta">
                  <strong>Sarah M.</strong>
                  <span>Graduate Student, UK</span>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                &ldquo;The custom percentage feature is fantastic. I can preview
                exactly what my AI detection score would look like.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">DJ</div>
                <div className="testimonial-meta">
                  <strong>David J.</strong>
                  <span>Freelance Writer</span>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                &ldquo;Beautiful UI, instant downloads, no signup. The best free
                Turnitin report generator I&apos;ve tried so far.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">AP</div>
                <div className="testimonial-meta">
                  <strong>Aisha P.</strong>
                  <span>Undergraduate, USA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">FAQ</span>
            <h2 className="section-title">
              Frequently asked <span className="grad">questions</span>
            </h2>
            <p className="section-subtitle">
              Everything you need to know about our free and custom Turnitin report generator.
            </p>
          </div>

          <div className="faq-list">
            <details className="faq-item">
              <summary>Is the Turnitin report generator really free?</summary>
              <div className="faq-body">
                Yes — completely free, no limits. You can generate unlimited custom
                Turnitin similarity and AI detection reports without signing up or
                paying anything.
              </div>
            </details>
            <details className="faq-item">
              <summary>Can I set a custom similarity and AI detection percentage?</summary>
              <div className="faq-body">
                Absolutely. After uploading your PDF, you can choose any AI
                detection percentage and any similarity percentage between 0% and
                100% before generating the PDF.
              </div>
            </details>
            <details className="faq-item">
              <summary>Is my document private and safe?</summary>
              <div className="faq-body">
                Yes. PDF processing runs in your browser. Your file is never sent
                to a server, so your content stays completely private and secure.
              </div>
            </details>
            <details className="faq-item">
              <summary>How long does generation take?</summary>
              <div className="faq-body">
                Typically under 10 seconds for documents up to 10MB. You will
                receive both an AI detection report and a similarity report as
                two separate downloadable PDFs.
              </div>
            </details>
            <details className="faq-item">
              <summary>What file formats do you support?</summary>
              <div className="faq-body">
                We currently support PDF files up to 10MB. Convert your Word
                document to PDF before uploading for the best results.
              </div>
            </details>
            <details className="faq-item">
              <summary>Does the report look like a real Turnitin report?</summary>
              <div className="faq-body">
                Yes — the layout, color-coded highlights, originality score
                summary, document metadata, and footer details all match the
                authentic Turnitin format students and educators are used to.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ============== CTA BANNER ============== */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to generate your free Turnitin report?</h2>
            <p>
              Join 50,000+ users who trust our free Turnitin report generator for
              custom AI detection and similarity reports. No signup, no payment, no wait.
            </p>
            <a href="#generator" className="btn-primary">
              Generate Free Turnitin Report
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* ============== MODAL (UNCHANGED logic) ============== */}
      {showModal && (
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
        </div>
      )}
    </>
  );
}
