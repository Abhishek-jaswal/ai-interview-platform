'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Dashboard from '../dashboard/page';
import Header from '@/components/Header';

export default function LoginPage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
          <h1 className="text-3xl md:text-4xl font-bold mt-6 text-purple-700 text-center">
            Welcome, {session.user.name} 👋
          </h1>
          <div className="w-full max-w-4xl mt-6">
            <Dashboard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-purple-700 text-center">
        Login to your AI Interview Portal 🚀
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => signIn('github')}
          className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full transition w-full"
        >
          🐙 Login with GitHub
        </button>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition w-full"
        >
          🔵 Login with Google
        </button>
      </div>
    </div>
  );
}
