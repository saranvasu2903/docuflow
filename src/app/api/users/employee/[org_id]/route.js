import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma'; // or '@prisma/client' if you're not using custom build

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { org_id } = params;

  if (!org_id) {
    return NextResponse.json({ message: 'Missing org_id' }, { status: 400 });
  }

  try {
    const users = await prisma.users.findMany({
      where: {
        Org_ID: {
          equals: org_id,
          mode: 'insensitive' // optional, removes case sensitivity
        }
      }
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Error fetching users', error }, { status: 500 });
  }
}
