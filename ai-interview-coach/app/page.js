// app/page.js

'use client';
import ResumeUpload from './components/ResumeUpload';
import { RecoilRoot } from 'recoil';

export default function HomePage() {
  return (
    <RecoilRoot>
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6">AI Interview Coach</h1>
        <ResumeUpload />
      </main>
    </RecoilRoot>
  );
}
