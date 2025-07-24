import { PrismaClient } from '../../../../generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { organizationid } = params;

  if (!organizationid) {
    return NextResponse.json({ error: 'organizationid is required' }, { status: 400 });
  }

  try {
    const teammembers = await prisma.teammember.findMany({
      where: {
        organizationid: parseInt(organizationid),
      },
      include: {
        // include the related user using email match
        // But Prisma does not support join on arbitrary fields, so we'll handle this manually below
      },
    });

    if (!teammembers || teammembers.length === 0) {
      return NextResponse.json({ message: 'No team members found for this organization' }, { status: 404 });
    }

    // Get all emails from the teammembers
    const emails = teammembers.map((member) => member.email).filter(Boolean);

    // Fetch users whose emails match
    const users = await prisma.users.findMany({
      where: {
        email: {
          in: emails,
        },
      },
    });

    // Map users by email for quick lookup
    const usersByEmail = users.reduce((acc, user) => {
      if (user.email) acc[user.email] = user;
      return acc;
    }, {});

    // Combine teammember with user details
    const combinedData = teammembers.map((member) => {
      return {
        ...member,
        userDetails: usersByEmail[member.email] || null,
      };
    });

    return NextResponse.json(combinedData, { status: 200 });
  } catch (err) {
    console.error('Error fetching teammembers with user data:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
