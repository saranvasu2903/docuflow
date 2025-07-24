import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { org_id, tier_id, durationmonth } = await request.json();

    if (!org_id || !tier_id || !durationmonth) {
      return NextResponse.json(
        { error: "org_id, tier_id, and durationmonth are required" },
        { status: 400 }
      );
    }

    // Date calculation
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + Number(durationmonth));

    // Transaction: update both users and organization
    const [userUpdate, orgUpdate] = await prisma.$transaction([
      prisma.users.updateMany({
        where: { Org_ID: org_id },
        data: { tierid: String(tier_id) },
      }),
      prisma.organization.updateMany({
        where: { Org_ID: org_id },
        data: {
          tierid: String(tier_id),
          tierstartdate: startDate,
          tierenddate: endDate,
          status:"active"
        },
      }),
    ]);

    // Handle if organization not found
    if (orgUpdate.count === 0) {
      return NextResponse.json(
        { error: `Organization with Org_ID "${org_id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Tier updated successfully",
        usersUpdated: userUpdate.count,
        organizationsUpdated: orgUpdate.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating tier:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tiers = await prisma.tier.findMany();

    return NextResponse.json(
      { tiers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tiers:", error);
    return NextResponse.json(
      { error: "Failed to fetch tiers" },
      { status: 500 }
    );
  }
}