// app/api/organization/[userId]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma'; // adjust if your path is different

const prisma = new PrismaClient();

export async function GET(_req, { params }) {
  const { userId } = params;

  /* 1 ── Validate input */
  if (!userId) {
    return NextResponse.json(
      { error: 'userId parameter is required' },
      { status: 400 },
    );
  }

  try {
    /* 2 ── Get user → grab its Org_ID */
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { Org_ID: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 },
      );
    }

    if (!user.Org_ID) {
      return NextResponse.json(
        { message: 'This user has no Org_ID value (not linked to an organisation)' },
        { status: 404 },
      );
    }
    const organisation = await prisma.organization.findFirst({
      where: { Org_ID: user.Org_ID },
    });

    if (!organisation) {
      return NextResponse.json(
        { message: `No organisation found with Org_ID ${user.Org_ID}` },
        { status: 404 },
      );
    }

    /* 4 ── Success */
    return NextResponse.json(organisation, { status: 200 });
  } catch (err) {
    console.error('[GET /api/organization/:userId] →', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { userId } = params;
  const createdby = userId
  if (!createdby) {
    return new Response(JSON.stringify({ error: 'createdby parameter is required' }), { status: 400 });
  }

  try {
    const body = await req.json();
    const { createdby: _, ...updateData } = body;

    if (updateData.name) {
      const duplicate = await prisma.organization.findFirst({
        where: {
          name: updateData.name,
          NOT: {
            createdby: createdby
          }
        }
      });

      if (duplicate) {
        return new Response(
          JSON.stringify({ error: 'Organization name already exists for another user.' }),
          { status: 409 }
        );
      }
    }
    const updated = await prisma.organization.updateMany({
      where: { createdby },
      data: updateData,
    });

    if (updated.count === 0) {
      return new Response(JSON.stringify({ message: 'Organization not found' }), { status: 404 });
    }

    const updatedOrg = await prisma.organization.findFirst({ where: { createdby } });
    if (updatedOrg?.Org_ID) {
          try {
            await clerkClient.organizations.updateOrganization(updatedOrg.Org_ID, {
              name: updatedOrg.name
            });
          } catch (clerkErr) {
            console.error('Failed to update Clerk organization:', clerkErr);
          }
        }
    return new Response(JSON.stringify({ message: 'Organization updated', organization: updatedOrg }), { status: 200 });
  } catch (err) {
    console.error('Error updating organization:', err);
    return new Response(JSON.stringify({ error: (err && err.message) || String(err) || 'Unknown error' }), { status: 500 });
  }
}
