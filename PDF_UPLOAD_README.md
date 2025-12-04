# PDF Upload Implementation - Testing Guide

## Overview
The Turnitin PDF API route has been updated to accept PDF file uploads and dynamically generate pages for each uploaded PDF page within the Turnitin report.

## What Changed

### 1. API Route Changes
- **Method**: Changed from `GET` to `POST`
- **Input**: Now accepts `multipart/form-data` instead of URL parameters
- **File Upload**: Accepts a PDF file field named `pdf`

### 2. PDF Processing
- Uses `pdfjs-dist` to parse uploaded PDFs
- Uses `canvas` to convert each PDF page to PNG images
- Dynamically generates pages in the output PDF

### 3. Dependencies Installed
```bash
npm install pdfjs-dist canvas
```

## How to Test

### Using Postman or Thunder Client

1. **Create a POST request**:
   - URL: `http://localhost:3000/api/turnitin-pdf`
   - Method: `POST`
   - Body Type: `form-data`

2. **Add form fields**:
   ```
   reportTitle: "Your Report Title"
   subtitle: "Your Subtitle"
   fileName: "test-document.pdf"
   wordCount: "4125"
   charCount: "25069"
   similarityPercent: "0"
   aiPercent: "27"
   fileSize: "380.7 KB"
   institution: "COMSATS Institute of Information Technology"
   pdf: [Select your PDF file]
   ```

3. **Send the request** and save the response as a PDF file

### Using cURL

```bash
curl -X POST http://localhost:3000/api/turnitin-pdf \
  -F "reportTitle=Test Report" \
  -F "subtitle=Test Subtitle" \
  -F "fileName=document.pdf" \
  -F "wordCount=4125" \
  -F "charCount=25069" \
  -F "similarityPercent=0" \
  -F "aiPercent=27" \
  -F "fileSize=380.7 KB" \
  -F "institution=COMSATS Institute of Information Technology" \
  -F "[email protected]" \
  --output turnitin-report.pdf
```

### Using JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append('reportTitle', 'Test Report');
formData.append('subtitle', 'Test Subtitle');
formData.append('fileName', 'document.pdf');
formData.append('wordCount', '4125');
formData.append('charCount', '25069');
formData.append('similarityPercent', '0');
formData.append('aiPercent', '27');
formData.append('fileSize', '380.7 KB');
formData.append('institution', 'COMSATS Institute of Information Technology');
formData.append('pdf', pdfFileInput.files[0]); // From file input

const response = await fetch('http://localhost:3000/api/turnitin-pdf', {
  method: 'POST',
  body: formData
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'turnitin-report.pdf';
a.click();
```

## Expected Output

The generated PDF will contain:
1. **Page 1**: Cover page with document details
2. **Page 2**: AI detection results and FAQ
3. **Pages 3+**: Each page from your uploaded PDF, fitted within the Turnitin report template

Each uploaded PDF page will have:
- Header with Turnitin logo and page number
- The PDF page content centered and scaled to fit
- Footer with submission ID

## Troubleshooting

### If you get errors about `canvas` module:

On Windows, you might need to install additional dependencies:
```bash
npm install --save-dev @types/node
npm rebuild canvas --build-from-source
```

Or use the legacy canvas version:
```bash
npm install canvas@2.11.2
```

### If PDF processing fails:

The code will still generate the report without the PDF pages. Check:
- The PDF file is valid and not corrupted
- The file size is reasonable (< 50MB recommended)
- The PDF is not password-protected

### Memory Issues:

For large PDFs, you might need to:
- Reduce the scale factor (currently 2.0) to 1.5 or 1.0
- Process pages in batches
- Increase Node.js memory limit:
  ```bash
  NODE_OPTIONS="--max-old-space-size=4096" npm run dev
  ```

## File Structure

```
/api/turnitin-pdf/route.tsx
├── PDF Processing (lines 307-360)
│   ├── FormData parsing
│   ├── PDF file extraction
│   ├── PDF parsing with pdfjs-dist
│   └── Page-to-image conversion
├── Document Generation (lines 363-695)
│   ├── Page 1: Cover page
│   ├── Page 2: AI detection & FAQ
│   └── Pages 3+: Dynamic PDF pages
└── Response handling
```

## Next Steps

1. Test with a small PDF (2-3 pages) first
2. Verify all pages are rendering correctly
3. Check that images are properly scaled and positioned
4. Test with different PDF sizes and formats
5. Create a frontend form to upload PDFs easily

## Notes

- The implementation converts each PDF page to a high-resolution PNG image
- Page scaling is set to 2.0 for good quality (can be adjusted)
- Images are centered and scaled to fit the page
- Headers and footers are consistent with the Turnitin template
