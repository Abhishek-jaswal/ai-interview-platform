'use client';

import { useState } from 'react';
import { extractTextFromPDF } from '@/lib/parsePdf';

export default function UploadPage() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async function () {
      const buffer = new Uint8Array(this.result);
      const extracted = await extractTextFromPDF(buffer);
      setText(extracted);
      setAnalysis('');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ resumeText: text }),
    });
    if (!res.ok) {
        const errText = await res.text();
        console.error('Server error:', errText);
        setAnalysis('Server Error: ' + errText);
        setLoading(false);
        return;
      }

    const data = await res.json();
    setAnalysis(data.result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
    <div className="p-4 max-w-2xl mx-auto items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Your Resume (PDF)</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={handleUpload}
        className="mb-4"
      />

      {fileName && (
        <p className="mb-2 text-sm text-gray-600">Uploaded: {fileName}</p>
      )}

      <textarea
        value={text}
        rows={10}
        readOnly
        className="w-full p-4 border rounded mb-4"
        placeholder="Extracted text will appear here..."
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !text}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold transition"
      >
        {loading ? 'Analyzing...' : 'Analyze with AI'}
      </button>

      {analysis && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">AI Analysis</h2>
          <pre className="whitespace-pre-wrap">{analysis}</pre>
        </div>
      )}
    </div>
    </div>
  );
}
