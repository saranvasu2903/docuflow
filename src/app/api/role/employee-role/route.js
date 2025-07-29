import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const organizationId = req.headers.get("x-organization-id");

    if (!organizationId) {
      return new Response(
        JSON.stringify({ error: "organizationId is required in headers." }),
        { status: 400 }
      );
    }

    const roles = await prisma.role.findMany({
      where: {
        organization_id: organizationId,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return new Response(JSON.stringify({ roles }), { status: 200 });
  } catch (error) {
    console.error("Error fetching roles with permissions:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}
