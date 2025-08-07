import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const organizationId = req.headers.get('x-organization-id');
    const id = Number(params.id); 

    if (!organizationId) {
      return new Response(
        JSON.stringify({ error: 'organizationId is required in headers.' }),
        { status: 400 }
      );
    }

    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ error: 'Valid numeric Role ID is required in params.' }),
        { status: 400 }
      );
    }

    if (id === 0) {
      const defaultResponse = {
        id: 0,
        roleName: 'admin',
        organization_id: organizationId,
        permissions: [
          { module: 'settings', actions: ['view', 'add', 'edit', 'delete'] },
          { module: 'projects', actions: ['view', 'add', 'edit', 'delete'] },
          { module: 'documents', actions: ['view', 'add', 'edit', 'delete'] },
          { module: 'teamlead-task', actions: ['view', 'add', 'edit', 'delete'] },
          // { module: 'employee-task', actions: ['view', 'add', 'edit', 'delete'] },
          { module: 'approved-task', actions: ['view', 'add', 'edit', 'delete'] },
          { module: 'employee', actions: ['view', 'add', 'edit', 'delete'] },
          { module: 'todo-list', actions: ['view', 'add', 'edit', 'delete'] },
          { module: 'events', actions: ['view', 'add', 'edit', 'delete'] },
        ],
      };

      return new Response(JSON.stringify({ data: defaultResponse }, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const role = await prisma.role.findFirst({
      where: {
        id,
        organization_id: organizationId,
        is_active: true,
      },
      include: {
        modules: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!role) {
      return new Response(
        JSON.stringify({ error: 'Role not found.' }),
        { status: 404 }
      );
    }

    const formatted = {
      id: role.id,
      roleName: role.name,
      organization_id: role.organization_id,
      permissions: role.modules.map((mod) => ({
        module: mod.name,
        actions: mod.permissions.map((perm) => perm.name),
      })),
    };

    return new Response(JSON.stringify({ data: formatted }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500 }
    );
  }
}
