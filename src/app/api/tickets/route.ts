import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Tickets fetch error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const ticket = await prisma.ticket.create({
      data: {
        fixtureId: body.fixtureId,
        type: body.type || 'regular',
        price: body.price,
        quantity: body.quantity,
      },
    })
    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('Ticket creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create tickets' },
      { status: 500 }
    )
  }
}
