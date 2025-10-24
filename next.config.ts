import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirects (opsional)
  async redirects() {
    return [
      // contoh:
      // {
      //   source: "/",
      //   destination: "/events",
      //   permanent: true,
      // },
    ];
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },

  images: {
    domains: ["localhost", "ipfs.io", "nftstorage.link"],
  },
};

export default nextConfig;
