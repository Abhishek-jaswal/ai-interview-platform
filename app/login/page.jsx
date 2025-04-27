'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Dashboard from '../dashboard/page';
import Header from '@/components/Header';

export default function LoginPage() {
  const { data: session } = useSession();

  if (session) {
    return (
        <div><Header/>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <h1 className="text-3xl font-bold mt-6 text-purple-700">Welcome, {session.user.name} 👋</h1>
        <Dashboard/>
      
      
        </div>
        </div>
    
    );
  }

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Login to your AI Interview Portal 🚀</h1>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => signIn('github')}
          className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full transition"
        >
          🐙 Login with GitHub
        </button>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition"
        >
          🔵 Login with Google
        </button>
      </div>
    </div>
   
  );
}
