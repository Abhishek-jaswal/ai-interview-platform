'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  const router = useRouter();

  return (
     
      <div className="  shadow-lg rounded-2xl p-4 max-w-3xl w-full space-y-4">
      <ProtectedRoute>
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-4 mt-8">
          🚀 AI Interview Portal Dashboard
        </h1>
        <p className="text-center text-lg font-semibold text-gray-700">Welcome to your AI Interview Portal!</p>
        <div className="space-y-4 text-center mt-6">
          <Link
            href="/upload"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold transition"
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
        </ProtectedRoute>
      </div>
   
  );
}
