/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["cloud.appwrite.io", "upload.wikimedia.org"],
  },
};

module.exports = nextConfig;
