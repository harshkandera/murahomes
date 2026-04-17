import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await req.json();

    // Remove properties that are not in Prisma schema
    const { features, ...validData } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: validData.name,
        slug: validData.slug,
        category: validData.category,
        brand: validData.brand,
        description: validData.description,
        dimensions: validData.dimensions,
        images: Array.isArray(validData.images) ? validData.images.flatMap(img => typeof img === 'string' ? img.split(',').map(s => s.trim()).filter(Boolean) : []) : [],
        price: validData.price ? parseFloat(validData.price) : undefined,
        materials: validData.materials ? (Array.isArray(validData.materials) ? validData.materials : validData.materials.split(',').map(m => m.trim())) : undefined,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('CRITICAL PATH ERROR: Failed to update product:', error.message || error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
