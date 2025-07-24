import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';
import { clerkClient } from '@clerk/clerk-sdk-node';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      parentid,
      fullname,
      email,
      organizationid,
      Org_ID,
    } = body;

    if (!parentid || !email || !organizationid) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
    }

    const newMember = await prisma.teammember.create({
      data: {
        parentid,
        fullname,
        email,
        organizationid,
        status: "pending",
        Org_ID
      }
    });

    const invitation = await clerkClient.organizations.createOrganizationInvitation({
      organizationId: Org_ID,
      emailAddress: email,
      role: 'org:member'
    });

    return new Response(JSON.stringify({
      db: newMember,
      clerk: {
        invitationId: invitation.id,
        emailAddress: invitation.emailAddress
      }
    }), { status: 201 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
export async function GET() {
  try {
    const teammembers = await prisma.teammember.findMany();

    return NextResponse.json(
      { teammembers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching teammembers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teammembers" },
      { status: 500 }
    );
  }
}