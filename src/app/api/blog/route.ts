import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const all = searchParams.get('all') === 'true' // admin: include drafts

    const posts = await prisma.blogPost.findMany({
      where: {
        ...(!all && { published: true }),
        ...(category && { category }),
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Blog fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Auto-generate slug from title if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80)
      + '-' + Date.now().toString(36)

    // Auto-generate excerpt from HTML content if not provided
    const excerpt = body.excerpt || body.content
      .replace(/<[^>]*>/g, '')
      .trim()
      .slice(0, 160) || body.title

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title: body.title,
        excerpt,
        content: body.content,
        coverImage: body.coverImage || null,
        category: body.category || 'News',
        author: body.author || 'Admin',
        published: body.published ?? true,
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Blog post creation error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
