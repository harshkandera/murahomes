import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const consultations = await prisma.consultation.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(consultations);
  } catch (error) {
    console.error('Consultation Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}
