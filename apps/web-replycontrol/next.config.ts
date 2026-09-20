import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the app self-contained; transpile workspace packages if needed
  transpilePackages: [
    "@mind-reply/elysium-core",
    "@mind-reply/lumenforge",
    "@mind-reply/veridex",
  ],
  // Avoid emitting source maps in production images unless needed for debugging
  productionBrowserSourceMaps: false,
  // Explicit output for Docker / standalone-friendly builds when desired
  // output: "standalone", // enable only after verifying monorepo paths
};

export default nextConfig;
