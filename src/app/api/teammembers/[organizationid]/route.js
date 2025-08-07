import { PrismaClient } from "../../../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { organizationid } = params;

  if (!organizationid) {
    return NextResponse.json(
      { error: "organizationid is required" },
      { status: 400 }
    );
  }

  try {
    const teammembers = await prisma.teammember.findMany({
      where: {
        organizationid: parseInt(organizationid),
      },
    });

    if (!teammembers || teammembers.length === 0) {
      return NextResponse.json(
        { message: "No team members found for this organization" },
        { status: 404 }
      );
    }

    const emails = teammembers.map((member) => member.email).filter(Boolean);

    const users = await prisma.users.findMany({
      where: {
        email: {
          in: emails,
        },
      },
    });

    const roleIds = [...new Set(users.map((u) => u.role).filter(Boolean))];

    const roles = await prisma.role.findMany({
      where: {
        id: {
          in: roleIds.map((id) => parseInt(id)),
        },
      },
    });

    const rolesById = roles.reduce((acc, role) => {
      acc[role.id] = role.name;
      return acc;
    }, {});

    const usersByEmail = users.reduce((acc, user) => {
      if (user.email) {
        acc[user.email] = {
          ...user,
          roleName: rolesById[parseInt(user.role)] || null,
        };
      }
      return acc;
    }, {});

    const combinedData = teammembers.map((member) => {
      return {
        ...member,
        userDetails: usersByEmail[member.email] || null,
      };
    });

    return NextResponse.json(combinedData, { status: 200 });
  } catch (err) {
    console.error("Error fetching teammembers with user/role data:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
