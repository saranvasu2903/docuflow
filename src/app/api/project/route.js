import { PrismaClient } from '@/generated/prisma';
const prisma = new PrismaClient();

export async function POST(request) {
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

    // Basic required fields validation
    if (!name || !createdby || !start_date || !end_date || !org_id) {
      return new Response(
        JSON.stringify({
          error: 'name, createdby, start_date, end_date, and org_id are required.'
        }),
        { status: 400 }
      );
    }

    const newProject = await prisma.projects.create({
      data: {
        name,
        description,
        createdby,
        org_id,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        project_members: {
          create: project_members.map((member) => ({
            user_id: member.user_id,
            role_in_project: member.role_in_project
          }))
        }
      },
      include: {
        project_members: true
      }
    });

    return new Response(
      JSON.stringify({
        message: 'Project created successfully',
        project: newProject
      }),
      { status: 201 }
    );

  } catch (err) {
    console.error('Error creating project:', err);
    return new Response(
      JSON.stringify({
        error: err.message || 'Internal server error'
      }),
      { status: 500 }
    );
  }
}

