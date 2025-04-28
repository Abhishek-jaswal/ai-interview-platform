'use client';

import { useState } from 'react';
import { extractTextFromPDF } from '@/lib/parsePdf';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';

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
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4 md:p-8">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10 w-full max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-purple-700">
            📄 Upload Your Resume (PDF)
          </h1>

          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="border border-purple-300 p-3 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition"
            />

            {fileName && (
              <p className="text-sm text-gray-600 text-center">
                Uploaded: <span className="font-medium">{fileName}</span>
              </p>
            )}

            <textarea
              value={text}
              rows={8}
              readOnly
              className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Extracted text will appear here..."
            />

            <button
              onClick={handleAnalyze}
              disabled={loading || !text}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-bold transition w-full"
            >
              {loading ? 'Analyzing...' : 'Analyze with AI'}
            </button>

            {analysis && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 text-purple-700">🧠 AI Analysis</h2>
                <pre className="whitespace-pre-wrap text-gray-700">{analysis}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
