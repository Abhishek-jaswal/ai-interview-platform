import './globals.css';
import SessionProviderWrapper from './providers/SessionProviderWrapper';

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
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
