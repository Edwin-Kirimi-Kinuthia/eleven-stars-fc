import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name: body.name,
        role: body.role,
        bio: body.bio ?? null,
        avatar: body.avatar ?? null,
      },
    })
    return NextResponse.json(member)
  } catch (error) {
    console.error('Team member update error:', error)
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.teamMember.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Team member deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}
