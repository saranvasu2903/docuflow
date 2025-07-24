import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  const { user } = body;
  if (!user || !user.id) {
    return NextResponse.json({ error: 'User data required' }, { status: 400 });
  }
  try {
    const email = user.emailAddresses?.[0]?.emailAddress || null;
    const role = user?.organizationMemberships?.[0]?.role === 'org:member' ? 'employee' : 'admin';
    let organizationId = null;
    let organizationIdFromUser = user.publicMetadata?.organization || null;
    if (organizationIdFromUser) {
      const result_query = await prisma.$queryRaw`
        SELECT id FROM "Organization" WHERE "Org_ID" = ${organizationIdFromUser} LIMIT 1
      `;
      const organization = result_query?.[0];
      if (organization) {
        organizationId = organization.id;
      } else {
        console.warn(`Organization with Org_ID ${organizationIdFromUser} not found.`);
      }
    }

    if (!organizationId && email) {
      const teamMember = await prisma.teammember.findFirst({
        where: { email },
        select: { organizationid: true, Org_ID: true },
      });

      if (teamMember) {
        organizationId = teamMember.organizationid;
        organizationIdFromUser = teamMember.Org_ID;
      }
    }

    const result = await prisma.users.upsert({
      where: { id: user.id },
      update: {
        email,
        fulldata: user,
        organizationid: organizationId,
        Org_ID: organizationIdFromUser,
      },
      create: {
        id: user.id,
        email,
        fulldata: user,
        role,
        organizationid: organizationId,
        Org_ID: organizationIdFromUser,
      },
    });

    return NextResponse.json({ success: true, user: result });

  } catch (err) {
    console.error('User sync failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
