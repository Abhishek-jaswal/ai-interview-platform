'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center  font-[family-name:var(--font-patrick-hand)] ">
        <div className="shadow-lg rounded-2xl p-6 md:p-10  max-w-3xl w-full ">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-4">
             AI Interview Portal Dashboard
          </h1>
          <p className="text-center text-lg font-semibold text-gradient text-gray-500">
            Welcome to your AI Interview Portal!
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
            <Link
              href="/upload"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-bold text-center transition w-full md:w-auto"
            >
              Upload Resume & Get Feedback
            </Link>
            <Link
              href="/interview"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-bold text-center transition w-full md:w-auto"
            >
              Start Mock Interview
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
