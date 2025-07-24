import { PrismaClient } from "../../../generated/prisma";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export const runtime = "nodejs";

import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { convertFileToPDF } from "@/utils/convertFileToPDF";

export const config = {
  api: {
    bodyParser: false,
  },
};

function webStreamToNodeReadable(webStream) {
  return Readable.from(webStream);
}

async function parseForm(req) {
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const form = formidable({
    uploadDir: uploadsDir,
    keepExtensions: true,
    multiples: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(request) {
  try {
    const nodeReadable = webStreamToNodeReadable(request.body);
    const req = Object.assign(nodeReadable, {
      headers: Object.fromEntries(request.headers.entries()),
    });

    const { fields, files } = await parseForm(req);

    const batchName = Array.isArray(fields.batchName)
      ? fields.batchName[0]
      : fields.batchName;
    if (!batchName) {
      return NextResponse.json(
        { success: false, error: "Batch name is required" },
        { status: 400 }
      );
    }

    const uploadedFiles = Array.isArray(files.file)
      ? files.file
      : files.file
      ? [files.file]
      : [];
    if (!uploadedFiles.length) {
      return NextResponse.json(
        { success: false, error: "No files uploaded" },
        { status: 400 }
      );
    }

    const organizationId = ""; // ← Replace this with your actual logic

    // Check if batch exists
    let batch = await prisma.batch.findFirst({
      where: { batchname: batchName, organizationid: organizationId },
    });

    if (!batch) {
      // Create new batch
      batch = await prisma.batch.create({
        data: {
          batchname: batchName,
          organizationid: organizationId,
        },
      });
    }

    const batchDir = path.join(process.cwd(), "public/uploads", batchName);
    await fs.mkdir(batchDir, { recursive: true }); // create if not exists

    // ✅ Check for global duplicate image names
    const allExistingImages = await prisma.imagecollection.findMany({
      where: {
        imagename: {
          in: uploadedFiles.map((f) => f.originalFilename),
        },
      },
      select: { imagename: true },
    });

    const existingGlobalNames = new Set(
      allExistingImages.map((img) => img.imagename)
    );

    const results = [];
    const skippedImages = [];

    for (const file of uploadedFiles) {
      const imageName = file.originalFilename;

      if (existingGlobalNames.has(imageName)) {
        skippedImages.push({
          imagename: imageName,
          message: `Image '${imageName}' already exists in the database. Skipping upload.`,
        });
        continue;
      }

      const finalFilePath = path.join(batchDir, imageName);
      await fs.rename(file.filepath, finalFilePath);

      const pdfOutputPath = await convertFileToPDF(
        finalFilePath,
        imageName,
        batchDir
      );

      results.push({
        batchid: batch.id,
        batchname: batchName,
        imagename: imageName,
        imagepath: `/uploads/${batchName}/${imageName}`,
        pdfconvert: pdfOutputPath
          ? `/uploads/${batchName}/${path.basename(pdfOutputPath)}`
          : null,
        organizationid: organizationId,
      });
    }

    if (results.length > 0) {
      await prisma.imagecollection.createMany({ data: results });
    }

    return NextResponse.json({
      success: true,
      batch: batchName,
      uploaded: results.map((f) => ({
        imagename: f.imagename,
        imagepath: f.imagepath,
        pdfconvert: f.pdfconvert ?? "PDF conversion failed",
      })),
      skipped: skippedImages,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const organizationId = request.headers.get("x-organization-id");

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const batches = await prisma.batch.findMany({
      where: {
        isdelete: false,
        organizationid: organizationId,
      },
      include: {
        imagecollection: {
          where: {
            isdelete: false,
          },
        },
      },
    });

    return NextResponse.json(batches, { status: 200 });
  } catch (error) {
    console.error("Error fetching batch data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
