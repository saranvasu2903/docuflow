import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { org_id } = params;

  if (!org_id) {
    return NextResponse.json({ error: "Missing org_id" }, { status: 400 });
  }

  try {
    const projects = await prisma.projects.findMany({
      where: {
        org_id: org_id,
      },
      include: {
        project_members: {
          include: {
            users: true, // 👈 includes full user data for each member
          },
        },
      },
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", details: error.message },
      { status: 500 }
    );
  }
}
