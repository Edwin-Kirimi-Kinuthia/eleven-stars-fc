import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(members)
  } catch (error) {
    console.error('Team fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const member = await prisma.teamMember.create({
      data: {
        name: body.name,
        role: body.role,
        bio: body.bio || null,
        avatar: body.avatar || null,
      },
    })
    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Team member creation error:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
