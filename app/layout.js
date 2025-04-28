'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
export const metadata = {
  title: "AI Interview Portal",
  description: "Upload your resume and practice mock interviews with AI!",
  icons: {
    icon: "/favicon.ico",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
