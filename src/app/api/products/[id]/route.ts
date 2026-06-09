import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        price: body.price,
        category: body.category,
        description: body.description,
        emoji: body.emoji,
        badge: body.badge,
        photo: body.photo ?? null,
        stock: body.stock,
        sizes: body.sizes ?? null,
        colors: body.colors ?? null,
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
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
    await prisma.product.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
