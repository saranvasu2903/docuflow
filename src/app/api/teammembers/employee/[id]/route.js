import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  const teammemberId = parseInt(params.id, 10); 
  const { fullname, status, role } = await req.json();

  try {
    const teammember = await prisma.teammember.findUnique({
      where: { id: teammemberId },
    });

    if (!teammember || !teammember.email) {
      return NextResponse.json({ error: 'Teammember not found or missing email' }, { status: 404 });
    }

    const email = teammember.email;

    await prisma.teammember.update({
      where: { id: teammemberId },
      data: {
        fullname,
        status,
      },
    });

    await prisma.users.updateMany({
      where: { email },
      data: {
        fullname,
        role,
      },
    });

    return NextResponse.json({ message: 'Employee Details updated' }, { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Update failed', details: error.message }, { status: 500 });
  }
}