import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    // Project images are hosted on ImageKit. Add your custom ImageKit domain here if you use one.
    remotePatterns: [{ protocol: "https", hostname: "ik.imagekit.io" }],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
