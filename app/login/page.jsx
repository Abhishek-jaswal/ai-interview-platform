'use client';

import { signIn, useSession } from 'next-auth/react';
import Dashboard from '../dashboard/page';
import Header from '@/components/Header';
import Image from "next/image";
import Link from 'next/link';

export default function LoginPage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,_#a7f3d0,_#ffffff,_#fef9c3)] p-4">
          <h1 className="text-3xl md:text-4xl font-bold mt-6 text-gray-800 text-center">
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 pb-0 font-[family-name:var(--font-patrick-hand)]">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
        AI-Interview Platform
      </h1>
      <p className="text-sm mb-6 text-center text-gray-300">Sign in to continue</p>

      {/* Email & Password Form */}
      <div className="bg-gray-700 p-6 rounded-2xl shadow-md w-full max-w-xs space-y-4">
        <div>
          <label className="block text-sm mb-1">EMAIL</label>
          <input
            type="email"
            placeholder="hello@yourwebsite.com"
            className="w-full px-4 py-2 text-black rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">PASSWORD</label>
          <input
            type="password"
            placeholder="•••••"
            className="w-full px-4 py-2 text-black rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        {/* Centered login button */}
        <div className="flex justify-center">
          <button
            className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-6 rounded-xl transition shadow hover:shadow-lg"
          >
            log in
          </button>
        </div>
      </div>

      {/* Social Login */}
      <div className="flex flex-col gap-4 mt-6 w-full max-w-xs">
        <button
          onClick={() => signIn('github')}
          className="bg-gray-50 hover:bg-gray-200 text-black font-semibold py-3 px-6 rounded-2xl transition shadow hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Image src="/screenshots/github.png" alt="GitHub Logo" width={20} height={20} />
          Login with GitHub
        </button>
        <button
          onClick={() => signIn('google')}
          className="bg-gray-50 hover:bg-gray-200 text-black font-semibold py-3 px-6 rounded-2xl transition shadow hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Image src="/screenshots/google.jpg" alt="Google Logo" width={20} height={20} />
          Login with Google
        </button>
        <Link href="/dashboard" className="text-center text-blue-400 hover:underline">onClick to register</Link>
      </div>
    </div>
  );
}
