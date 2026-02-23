/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... your existing config (images, redirects, etc. if any)

  turbopack: {},  // ← This empty object tells Next.js you're aware of Turbopack → silences the warning/error
};

export default nextConfig;