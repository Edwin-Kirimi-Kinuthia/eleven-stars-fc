import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const donations = await prisma.donation.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(donations)
  } catch (error) {
    console.error('Donations fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const donation = await prisma.donation.create({
      data: {
        amount: body.amount,
        donorName: body.donorName || null,
        email: body.email || null,
        phone: body.phone,
        tier: body.tier || null,
        message: body.message || null,
        status: body.status || 'pending',
      },
    })
    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    console.error('Donation creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    )
  }
}
