/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: false,
            },
        ]
    },
    images: {
        domains: [
            'avatar.iran.liara.run'
        ]
    }
};

export default nextConfig;
