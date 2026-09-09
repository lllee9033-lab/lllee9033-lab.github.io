import { NextConfig } from 'next'
import { codeInspectorPlugin } from 'code-inspector-plugin'

const isGitHubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig: NextConfig = {
	output: isGitHubPages ? 'export' : 'standalone',
	...(isGitHubPages
		? {
				trailingSlash: true,
				images: { unoptimized: true }
			}
		: { outputFileTracingRoot: process.cwd() }),
	devIndicators: false,
	reactStrictMode: false,
	reactCompiler: true,
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
	typescript: {
		ignoreBuildErrors: true
	},
	experimental: {
		scrollRestoration: false
	},
	turbopack: {
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js'
			}
			// ...codeInspectorPlugin({
			// 	bundler: 'turbopack'
			// })
		},

		resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json', 'css']
	},
	webpack: config => {
		config.module.rules.push({
			test: /\.svg$/i,
			use: [{ loader: '@svgr/webpack', options: { svgo: false } }]
		})

		return config
	}
}

if (!isGitHubPages) {
	nextConfig.redirects = async () => [
		{
			source: '/zh',
			destination: '/',
			permanent: true
		},
		{
			source: '/en',
			destination: '/',
			permanent: true
		}
	]
}

export default nextConfig
