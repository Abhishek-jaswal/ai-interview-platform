'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-gray-100 shadow-lg rounded-2xl p-8 max-w-3xl w-full space-y-4">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-4">
          🚀 AI Interview Portal Dashboard
        </h1>
        <p className="text-center text-lg font-semibold text-gray-700">Welcome to your AI Interview Portal!</p>
        <div className="space-y-4 text-center mt-6">
          <Link
            href="/upload"
            className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold transition"
          >
            Upload Resume & Get Feedback
          </Link>
          <Link
            href="/interview"
            className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold transition mt-4"
          >
            Start Mock Interview
          </Link>
        </div>
      </div>
    </div>
  );
}
