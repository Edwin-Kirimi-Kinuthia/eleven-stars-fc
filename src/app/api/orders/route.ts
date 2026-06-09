import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.user.role === 'admin') {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      })
      return NextResponse.json(orders)
    }

    const userId = (session.user as { id?: string }).id
    if (!userId) return NextResponse.json([])
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = (session?.user as { id?: string })?.id ?? null

    const body = await req.json()
    const { items, total, name, phone, email, address } = body
    if (!items || !total || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        userId,
        items,
        total,
        name,
        phone,
        email: email || null,
        address: address || null,
        status: 'pending',
      },
    })
    return NextResponse.json(order, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
