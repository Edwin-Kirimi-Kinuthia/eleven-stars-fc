import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: { number: 'asc' },
    })
    return NextResponse.json(players)
  } catch (error) {
    console.error('Players fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const player = await prisma.player.create({
      data: {
        number: body.number,
        name: body.name,
        position: body.position,
        nationality: body.nationality,
        isCaptain: body.isCaptain || false,
        photo: body.photo || null,
        appearances: body.appearances ?? 0,
        goals: body.goals ?? 0,
        assists: body.assists ?? 0,
        tackles: body.tackles ?? 0,
        interceptions: body.interceptions ?? 0,
        clearances: body.clearances ?? 0,
        blocks: body.blocks ?? 0,
        passes: body.passes ?? 0,
        passCompletion: body.passCompletion ?? 0,
        saves: body.saves ?? 0,
        cleanSheets: body.cleanSheets ?? 0,
        goalsAgainst: body.goalsAgainst ?? 0,
        shots: body.shots ?? 0,
        shotAccuracy: body.shotAccuracy ?? 0,
        dribbles: body.dribbles ?? 0,
        fifaRegistered: body.fifaRegistered ?? false,
      },
    })
    return NextResponse.json(player, { status: 201 })
  } catch (error) {
    console.error('Player creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    )
  }
}
