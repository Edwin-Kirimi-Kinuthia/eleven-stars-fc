import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const fixtures = await prisma.fixture.findMany({
      orderBy: [{ status: 'asc' }, { date: 'asc' }],
    })
    return NextResponse.json(fixtures)
  } catch (error) {
    console.error('Fixtures fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Admin form sends home/away/competition; normalise to schema field names
    const homeTeam = body.homeTeam ?? body.home ?? 'Eleven Stars FC'
    const awayTeam = body.awayTeam ?? body.away ?? ''
    const leagueName = body.leagueName ?? body.competition ?? 'Conference League 2026'
    const venue = body.venue ?? 'Meru Stadium'
    const status = body.status ?? 'upcoming'

    // Combine date + time into a DateTime if both provided
    let date: Date | null = null
    if (body.date) {
      date = body.time
        ? new Date(`${body.date}T${body.time}:00`)
        : new Date(body.date)
    }

    const fixture = await prisma.fixture.create({
      data: {
        homeTeam,
        awayTeam,
        date,
        venue,
        status,
        leagueName,
        homeScore: status === 'completed' && body.homeScore !== '' && body.homeScore != null
          ? Number(body.homeScore) : null,
        awayScore: status === 'completed' && body.awayScore !== '' && body.awayScore != null
          ? Number(body.awayScore) : null,
      },
    })
    return NextResponse.json(fixture, { status: 201 })
  } catch (error) {
    console.error('Fixture creation error:', error)
    return NextResponse.json({ error: 'Failed to create fixture' }, { status: 500 })
  }
}
