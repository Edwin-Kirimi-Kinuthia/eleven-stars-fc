import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const player = await prisma.player.update({
      where: { id },
      data: {
        name: body.name,
        number: body.number,
        position: body.position,
        nationality: body.nationality,
        isCaptain: body.isCaptain,
        photo: body.photo ?? null,
        goals: body.goals,
        assists: body.assists,
        appearances: body.appearances,
        tackles: body.tackles,
        interceptions: body.interceptions,
        clearances: body.clearances,
        blocks: body.blocks,
        passes: body.passes,
        passCompletion: body.passCompletion,
        saves: body.saves,
        cleanSheets: body.cleanSheets,
        goalsAgainst: body.goalsAgainst,
        shots: body.shots,
        shotAccuracy: body.shotAccuracy,
        dribbles: body.dribbles,
        fifaRegistered: body.fifaRegistered,
        bio: body.bio ?? null,
        drills: body.drills ?? null,
      },
    })
    return NextResponse.json(player)
  } catch (error) {
    console.error('Player update error:', error)
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.player.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Player deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    )
  }
}
