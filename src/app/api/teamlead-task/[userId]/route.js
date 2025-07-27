import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json(
      { error: 'userId parameter is required' },
      { status: 400 },
    );
  }

  const organizationid = req.headers.get('X-Organization-Id');
  if (!organizationid) {
    return NextResponse.json(
      { error: 'organizationid is required in headers' },
      { status: 400 }
    );
  }

  try {
    const documents = await prisma.documents.findMany({
      where: {
        organizationid,
        isdelete: false,
        isactive: true,
        teamlead: {
          contains: userId,
        },
      },
      include: {
        files: true,
        uploadedUser: {
          select: {
            fullname: true,
          },
        },
      },
    });

    return NextResponse.json({ data: documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
