import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const organizationid = req.headers.get("X-Organization-Id");
    if (!organizationid) {
      return NextResponse.json({ error: "organizationid is required in headers" }, { status: 400 });
    }

    const form = await req.formData();
    const projectname = form.get("projectName");
    const dueDateRaw = form.get("dueDate");
    const notes = form.get("notes") || null;
    const uploadedby = form.get("uploadedby");
    const files = form.getAll("files");
    const teamleadArray = form.getAll("teamlead"); 
    const teamlead = teamleadArray.length > 0 ? teamleadArray.join(",") : null;
    if (!projectname || files.length === 0) {
      return NextResponse.json({ error: "projectname and at least one file are required" }, { status: 400 });
    }

    const duedate = dueDateRaw ? new Date(dueDateRaw) : null;

    const document = await prisma.documents.create({
      data: {
        projectname,
        duedate,
        notes,
        organizationid,
        teamlead,
        uploadedby,
      }
    });

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const fileRows = [];

    for (const file of files) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name);
      const slug = `${randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, slug);

      await fs.writeFile(filePath, bytes);

      fileRows.push({
        documentid: document.id,
        filepath: `/uploads/${slug}`,
        filename: file.name
      });
    }

    await prisma.documents_files.createMany({ data: fileRows });

    return NextResponse.json({ document, files: fileRows }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "upload failed" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const organizationid = req.headers.get("X-Organization-Id");
    if (!organizationid) {
      return NextResponse.json(
        { error: "organizationid is required in headers" },
        { status: 400 }
      );
    }

    const documents = await prisma.documents.findMany({
      where: {
        organizationid,
      },
      include: {
        files: true,
        uploadedUser: {
          select: {
            fullname: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    // Optionally, map to flatten the structure
    const response = documents.map((doc) => ({
      ...doc,
      uploadedby_fullname: doc.uploadedUser?.fullname || null,
    }));

    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
