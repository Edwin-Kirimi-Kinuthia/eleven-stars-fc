import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.user.role === 'admin') {
      const purchases = await prisma.ticketPurchase.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      })
      return NextResponse.json(purchases)
    }

    const userId = (session.user as { id?: string }).id
    if (!userId) return NextResponse.json([])
    const purchases = await prisma.ticketPurchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(purchases)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = (session?.user as { id?: string })?.id ?? null

    const body = await req.json()
    const { ticketId, fixtureId, matchName, type, quantity, total, name, phone, email } = body
    if (!ticketId || !fixtureId || !type || !quantity || !total || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const purchase = await prisma.ticketPurchase.create({
      data: {
        userId,
        ticketId,
        fixtureId,
        matchName: matchName || 'Match',
        type,
        quantity,
        total,
        name,
        phone,
        email: email || null,
        status: 'pending',
      },
    })

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { sold: { increment: quantity } },
    })

    return NextResponse.json(purchase, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create purchase' }, { status: 500 })
  }
}
