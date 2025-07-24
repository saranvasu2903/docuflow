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
    const files = form.getAll("files");

    if (!projectname || files.length === 0) {
      return NextResponse.json({ error: "projectname and at least one file are required" }, { status: 400 });
    }

    const duedate = dueDateRaw ? new Date(dueDateRaw) : null;

    const document = await prisma.documents.create({
      data: {
        projectname,
        duedate: duedate,
        notes,
        organizationid
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
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
