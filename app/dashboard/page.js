'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
        <div className="shadow-lg rounded-2xl p-6 md:p-10 bg-white max-w-3xl w-full space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-purple-700 mb-4">
            🚀 AI Interview Portal Dashboard
          </h1>
          <p className="text-center text-lg font-semibold text-gray-700">
            Welcome to your AI Interview Portal!
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
            <Link
              href="/upload"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold text-center transition w-full md:w-auto"
            >
              Upload Resume & Get Feedback
            </Link>
            <Link
              href="/interview"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold text-center transition w-full md:w-auto"
            >
              Start Mock Interview
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
