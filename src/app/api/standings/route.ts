import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const standings = await prisma.standing.findMany({ orderBy: { position: 'asc' } })
    return NextResponse.json(standings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const standing = await prisma.standing.create({
      data: {
        leagueName: body.leagueName || 'Conference League 2026',
        teamName: body.teamName,
        position: Number(body.position) || 0,
        played: Number(body.played) || 0,
        won: Number(body.won) || 0,
        drawn: Number(body.drawn) || 0,
        lost: Number(body.lost) || 0,
        gf: Number(body.gf) || 0,
        ga: Number(body.ga) || 0,
        points: Number(body.points) || 0,
        isOurTeam: body.isOurTeam || false,
      },
    })
    return NextResponse.json(standing, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create standing' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all')
    if (all) {
      await prisma.standing.deleteMany({})
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Missing parameter' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
