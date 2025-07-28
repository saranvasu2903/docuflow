import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const roleId = parseInt(id);

    if (!roleId || isNaN(roleId)) {
      return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 });
    }

    const organizationId = req.headers.get('x-organization-id');
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Missing X-Organization-Id header' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { roleName, permissions } = body;

    // Update role name
    await prisma.role.update({
      where: {
        id: roleId,
        organization_id: organizationId,
      },
      data: {
        name: roleName,
      },
    });

    // 1. Get existing modules and permissions for the role
    const existingModules = await prisma.module.findMany({
      where: {
        role_id: roleId,
      },
      include: {
        permissions: true,
      },
    });

    const payloadModuleNames = permissions.map((p) => p.module.toLowerCase());

    // 2. Delete removed permissions and modules
    for (const module of existingModules) {
      const moduleInPayload = permissions.find(
        (p) => p.module.toLowerCase() === module.name.toLowerCase()
      );

      if (!moduleInPayload) {
        // Module is removed from payload → delete permissions and module
        await prisma.permission.deleteMany({
          where: { module_id: module.id },
        });
        await prisma.module.delete({
          where: { id: module.id },
        });
      } else {
        // Check for removed actions
        const actionNamesInPayload = moduleInPayload.actions.map((a) => a.toLowerCase());

        for (const permission of module.permissions) {
          if (!actionNamesInPayload.includes(permission.name.toLowerCase())) {
            await prisma.permission.delete({
              where: { id: permission.id },
            });
          }
        }
      }
    }

    // 3. Upsert modules and permissions
    for (const perm of permissions) {
      let module = await prisma.module.findFirst({
        where: {
          name: perm.module.toLowerCase(),
          role_id: roleId,
        },
      });

      if (!module) {
        module = await prisma.module.create({
          data: {
            name: perm.module.toLowerCase(),
            role_id: roleId,
          },
        });
      }

      for (const action of perm.actions) {
        const existingPermission = await prisma.permission.findFirst({
          where: {
            module_id: module.id,
            name: action.toLowerCase(),
          },
        });

        if (!existingPermission) {
          await prisma.permission.create({
            data: {
              name: action.toLowerCase(),
              module_id: module.id,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error updating role permissions:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
