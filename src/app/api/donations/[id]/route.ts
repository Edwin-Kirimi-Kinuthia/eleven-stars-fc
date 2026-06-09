import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const donation = await prisma.donation.update({
      where: { id },
      data: {
        status: body.status,
      },
    })
    return NextResponse.json(donation)
  } catch (error) {
    console.error('Error updating donation:', error)
    return NextResponse.json(
      { error: 'Failed to update donation' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const donation = await prisma.donation.findUnique({
      where: { id },
    })
    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(donation)
  } catch (error) {
    console.error('Error fetching donation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch donation' },
      { status: 500 }
    )
  }
}
