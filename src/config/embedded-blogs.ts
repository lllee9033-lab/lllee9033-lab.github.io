import type { BlogConfig } from '@/app/blog/types'

type EmbeddedBlog = {
	config: BlogConfig
	markdown: string
}

export const embeddedBlogs: Record<string, EmbeddedBlog> = {
	重新打开便签: {
		config: {
			title: '重新打开便签',
			tags: ['随笔'],
			date: '2026-09-09',
			dateLabel: '写于2026.9.9',
			summary: '随便说点什么',
			hidden: false,
			category: '随笔'
		},
		markdown: '记录总是好的，沉重的轻松的，有意义的没营养的，都是从我们身上跨过的时间，时间本没有影子，人写得多了便有了雏形。'
	}
}
