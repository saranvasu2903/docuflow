import { PrismaClient } from '@/generated/prisma';
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const organizationId = request.headers.get('x-organization-id');
    const body = await request.json();
    const { roleName, permissions } = body;

    if (!organizationId || !roleName || !Array.isArray(permissions)) {
      return new Response(
        JSON.stringify({
          error: 'organizationId (in headers), roleName, and permissions are required.'
        }),
        { status: 400 }
      );
    }

    const role = await prisma.role.create({
      data: {
        organization_id: organizationId,
        name: roleName,
      },
    });

    for (const perm of permissions) {
      const createdModule = await prisma.module.create({
        data: {
          name: perm.module,
          role_id: role.id,
        },
      });

      const permissionData = perm.actions.map((actionName) => ({
        name: actionName,
        module_id: createdModule.id,
      }));

      await prisma.permission.createMany({ data: permissionData });
    }

    return new Response(
      JSON.stringify({
        message: 'Role and permissions created successfully.',
        role_id: role.id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating role and permissions:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const organizationId = req.headers.get('x-organization-id');

    if (!organizationId) {
      return new Response(
        JSON.stringify({ error: 'organizationId is required in headers.' }),
        { status: 400 }
      );
    }

    const roles = await prisma.role.findMany({
      where: {
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

    const formatted = roles.map((role) => ({
      id: role.id,
      roleName: role.name,
      organization_id: role.organization_id,
      permissions: role.modules.map((mod) => ({
        module: mod.name,
        actions: mod.permissions.map((perm) => perm.name),
      })),
    }));

    return new Response(JSON.stringify({ data: formatted }), { status: 200 });
  } catch (error) {
    console.error('Error fetching roles with permissions:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500 }
    );
  }
}