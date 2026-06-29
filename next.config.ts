import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Turbopack does not pick up an
  // unrelated lockfile higher up the filesystem on local machines.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // Supabase Storage for real product photos later, plus the curated hero
    // image and testimonial avatars used on the marketing pages.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
    ],
  },
};

export default nextConfig;
