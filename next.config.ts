import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'et6i2cbbjl.ufs.sh',
			},
		],
	},
}

export default nextConfig
