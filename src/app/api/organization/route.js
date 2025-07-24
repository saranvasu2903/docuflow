import { PrismaClient } from '../../../generated/prisma';
import { clerkClient } from '@clerk/clerk-sdk-node';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      createdby,
      booking_url,
      website,
      phonenumber,
      instagram,
      facebook,
      workingfrom,
      workingto,
      teamsize,
      teamlogo,
      email,
      linkedin,
      x,
      industry,
      address,
      city,
      state,
      zip,
      country
    } = body;

    if (!name || !createdby || !phonenumber) {
      return new Response(
        JSON.stringify({ error: 'name, createdby, and phonenumber are required.' }),
        { status: 400 }
      );
    }

    const existingOrg = await prisma.organization.findFirst({
      where: {
        name: name
      }
    });

    if (existingOrg) {
      return new Response(
        JSON.stringify({ error: 'Organization name already exists.' }),
        { status: 409 } 
      );
    }

    const clerkOrg = await clerkClient.organizations.createOrganization({
      name,
      createdBy: createdby
    });

    const newOrg = await prisma.organization.create({
      data: {
        name,
        createdby,
        booking_url,
        website,
        phonenumber,
        instagram,
        facebook,
        workingfrom,
        workingto,
        teamsize,
        teamlogo,
        Org_ID: clerkOrg.id,
        email,
        linkedin,
        x,
        industry,
        address,
        city,
        state,
        zip,
        country,
        isverified: true
      }
    });

    await prisma.users.update({
      where: { id: createdby },
      data: {
        organizationid: newOrg.id,
        Org_ID: clerkOrg.id,
      }
    });

    try {
      await clerkClient.organizations.createOrganizationMembership({
        organizationId: clerkOrg.id,
        userId: createdby,
        role: 'org:admin'
      });
    } catch (error) {
    }
    return new Response(JSON.stringify({ dbOrg: newOrg, clerkOrg }), { status: 201 });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message || 'Unexpected server error'
      }),
      { status: 500 }
    );
  }
}
