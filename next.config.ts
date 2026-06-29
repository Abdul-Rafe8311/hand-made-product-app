import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Turbopack does not pick up an
  // unrelated lockfile higher up the filesystem on local machines.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // Allow real product photos to be served from Supabase Storage later.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
