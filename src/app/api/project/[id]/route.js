import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
  }

  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      include: {
        project_members: {
          include: {
            users: true, // include all user data first
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 🔧 Filter the `fulldata` in users
    const cleanedProject = {
      ...project,
      project_members: project.project_members.map((member) => ({
        ...member,
        users: {
          ...member.users,
          fulldata: member.users?.fulldata
            ? {
                id: member.users.fulldata.id,
                fullName: member.users.fulldata.fullName,
                imageUrl: member.users.fulldata.imageUrl,
                firstName: member.users.fulldata.firstName,
              }
            : null,
        },
      })),
    };

    return NextResponse.json({ project: cleanedProject }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch project", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing project ID" }), { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      name,
      description,
      createdby,
      start_date,
      end_date,
      org_id,
      project_members = []
    } = body;

    const projectId = parseInt(id, 10);
    if (isNaN(projectId)) {
      return new Response(JSON.stringify({ error: "Invalid project ID" }), { status: 400 });
    }

    // Step 1: Update project details
    await prisma.projects.update({
      where: { id: projectId },
      data: {
        name,
        description,
        createdby,
        org_id,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
      },
    });

    // Step 2: Handle project_members logic
    const existingMembers = await prisma.project_members.findMany({
      where: { project_id: projectId },
    });

    const existingIds = existingMembers.map((m) => m.id);
    const payloadIds = project_members.filter((m) => m.id).map((m) => m.id);

    // A. Delete members that exist in DB but not in the payload
    const toDeleteIds = existingIds.filter((id) => !payloadIds.includes(id));
    await prisma.project_members.deleteMany({
      where: {
        id: { in: toDeleteIds },
      },
    });

    // B. Update existing members
    for (const member of project_members) {
      if (member.id) {
        await prisma.project_members.update({
          where: { id: member.id },
          data: {
            user_id: member.user_id,
            role_in_project: member.role_in_project,
          },
        });
      }
    }

    // C. Create new members (those without ID)
    const newMembers = project_members.filter((m) => !m.id);
    for (const member of newMembers) {
      await prisma.project_members.create({
        data: {
          project_id: projectId,
          user_id: member.user_id,
          role_in_project: member.role_in_project,
        },
      });
    }

    // Step 3: Return the updated project with members
    const updatedProject = await prisma.projects.findUnique({
      where: { id: projectId },
      include: {
        project_members: true,
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Project updated successfully',
        project: updatedProject,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating project:', err);
    return new Response(
      JSON.stringify({
        error: err.message || 'Internal server error',
      }),
      { status: 500 }
    );
  }
}
