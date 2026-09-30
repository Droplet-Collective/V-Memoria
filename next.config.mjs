const isProd = process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_BASE_PATH !== "";
const basePath = isProd ? "/V-Memoria" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
