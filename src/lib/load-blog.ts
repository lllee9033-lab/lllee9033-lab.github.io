import type { BlogConfig } from '@/app/blog/types'
import { embeddedBlogs } from '@/config/embedded-blogs'

export type { BlogConfig } from '@/app/blog/types'

export type LoadedBlog = {
	slug: string
	config: BlogConfig
	markdown: string
	cover?: string
}

/**
 * Load blog data from public/blogs/{slug}
 * Used by both view page and edit page
 */
export async function loadBlog(slug: string): Promise<LoadedBlog> {
	if (!slug) {
		throw new Error('Slug is required')
	}

	let normalizedSlug = slug
	try {
		normalizedSlug = decodeURIComponent(slug)
	} catch {
		// Keep the original slug when it is not valid percent-encoded text.
	}
	const embeddedBlog = embeddedBlogs[normalizedSlug]
	const encodedSlug = encodeURIComponent(normalizedSlug)

	// Load config.json
	let config: BlogConfig = embeddedBlog?.config || {}
	const configRes = await fetch(`/blogs/${encodedSlug}/config.json`)
	if (configRes.ok) {
		try {
			config = { ...config, ...(await configRes.json()) }
		} catch {
			// Retain embedded metadata if the deployed asset is unavailable.
		}
	}

	// Load index.md
	const mdRes = await fetch(`/blogs/${encodedSlug}/index.md`)
	if (!mdRes.ok) {
		if (embeddedBlog) {
			return {
				slug: normalizedSlug,
				config,
				markdown: embeddedBlog.markdown,
				cover: config.cover
			}
		}
		throw new Error('Blog not found')
	}
	const fetchedMarkdown = await mdRes.text()
	const markdown = fetchedMarkdown.trim() || embeddedBlog?.markdown || ''

	return {
		slug: normalizedSlug,
		config,
		markdown,
		cover: config.cover
	}
}
