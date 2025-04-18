'use client';

import { useState } from 'react';

export default function InterviewForm() {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Evaluate this interview answer for a React developer: "${answer}" and return result as JSON like {score: 8/10, feedback: "..."}`
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Submission error:', err);
      setResult({ error: 'Something went wrong' });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded"
          rows="6"
          placeholder="Type your interview answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Evaluating...' : 'Submit Answer'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <p className="font-semibold">Score: {result.score}</p>
              <p className="mt-2">{result.feedback}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
