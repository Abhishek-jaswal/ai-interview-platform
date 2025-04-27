'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return null;

  return (
    <header className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-semibold">
        Welcome, {session?.user?.name || session?.user?.email}
      </div>
      <button
        onClick={() => {
          signOut({ callbackUrl: '/login' });
        }}
        className="bg-white text-purple-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition"
      >
        Logout
      </button>
    </header>
  );
}
