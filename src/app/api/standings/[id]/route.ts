import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const body = await request.json()
    const standing = await prisma.standing.update({
      where: { id },
      data: {
        leagueName: body.leagueName,
        teamName: body.teamName,
        position: Number(body.position),
        played: Number(body.played),
        won: Number(body.won),
        drawn: Number(body.drawn),
        lost: Number(body.lost),
        gf: Number(body.gf),
        ga: Number(body.ga),
        points: Number(body.points),
        isOurTeam: body.isOurTeam,
      },
    })
    return NextResponse.json(standing)
  } catch {
    return NextResponse.json({ error: 'Failed to update standing' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    await prisma.standing.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete standing' }, { status: 500 })
  }
}
