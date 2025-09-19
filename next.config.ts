import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.google.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "youtu.be",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "www.notion.so",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "127.0.0.1",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "*.*.*.*",
				pathname: "/**",
			},
		],
	},
	allowedDevOrigins: ["localhost", "*.*.*.*"],
};

export default nextConfig;
