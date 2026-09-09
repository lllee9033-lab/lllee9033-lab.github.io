import type { ReactNode } from 'react'
import blogIndex from '@/../public/blogs/index.json'

export const dynamicParams = false

export function generateStaticParams() {
	return blogIndex.map(blog => ({ slug: blog.slug }))
}

export default function WriteLayout({ children }: { children: ReactNode }) {
	return children
}
