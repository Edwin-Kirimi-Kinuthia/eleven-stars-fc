import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const homeTeam = body.homeTeam ?? body.home ?? 'Eleven Stars FC'
    const awayTeam = body.awayTeam ?? body.away ?? ''
    const leagueName = body.leagueName ?? body.competition ?? 'Conference League 2026'
    const status = body.status ?? 'upcoming'

    let date: Date | null = null
    if (body.date) {
      date = body.time
        ? new Date(`${body.date}T${body.time}:00`)
        : new Date(body.date)
    }

    const fixture = await prisma.fixture.update({
      where: { id },
      data: {
        homeTeam,
        awayTeam,
        date,
        venue: body.venue ?? 'Meru Stadium',
        status,
        leagueName,
        homeScore: status === 'completed' && body.homeScore !== '' && body.homeScore != null
          ? Number(body.homeScore) : null,
        awayScore: status === 'completed' && body.awayScore !== '' && body.awayScore != null
          ? Number(body.awayScore) : null,
      },
    })
    return NextResponse.json(fixture)
  } catch (error) {
    console.error('Fixture update error:', error)
    return NextResponse.json({ error: 'Failed to update fixture' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.fixture.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fixture deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete fixture' }, { status: 500 })
  }
}
