'use client';

export default function Footer() {
  return (
    <footer className="text-center text-sm text-gray-500 mt-10 p-4">
      <p>© 2025 AI Interview Portal. All rights reserved.</p>
      <div className="flex justify-center gap-4 mt-2">
        <a
          href="https://github.com/Abhishek-jaswal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          GitHub 
        </a>
        <a
          href="https://www.linkedin.com/in/abhishekjaswall"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          LinkedIn
        </a>
        <a
          href="https://abhishek-jaswal.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          Resume
        </a>
        <a
          href="/privacy-policy"
          className="text-blue-500 hover:text-blue-700"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}