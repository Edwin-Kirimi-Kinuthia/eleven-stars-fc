import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const { status, mpesaRef } = await req.json()
    const purchase = await prisma.ticketPurchase.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(mpesaRef !== undefined && { mpesaRef }),
      },
    })
    return NextResponse.json(purchase)
  } catch {
    return NextResponse.json({ error: 'Failed to update purchase' }, { status: 500 })
  }
}
