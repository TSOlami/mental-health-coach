/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://mental-health-coach.onrender.com/api/:path*",
            },
        ];
    }
};

export default nextConfig;
