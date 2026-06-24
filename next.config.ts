import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // drei is a large barrel; tree-shake to only what we import.
    // (lucide-react is already optimized by Next's default list.)
    optimizePackageImports: ["@react-three/drei"],
  },
};

export default nextConfig;
