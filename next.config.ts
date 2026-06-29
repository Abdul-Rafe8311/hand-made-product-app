import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
