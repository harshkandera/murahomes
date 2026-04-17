import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Appointment fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, appointmentDate, message } = body;

    if (!name || !email || !appointmentDate) {
      return NextResponse.json({ error: 'Name, email and date are required' }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: { name, email, phone: phone || null, appointmentDate, message: message || null },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Appointment create error:', error);
    return NextResponse.json({ error: 'Failed to save appointment' }, { status: 500 });
  }
}
