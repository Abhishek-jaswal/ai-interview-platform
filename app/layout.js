import './globals.css';
import SessionProviderWrapper from './providers/SessionProviderWrapper';
import Footer from '@/components/Footer';

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
      <body className="flex flex-col min-h-screen">
        <SessionProviderWrapper>
          <main className="flex-grow">{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
