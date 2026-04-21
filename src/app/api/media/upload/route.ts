import crypto from "node:crypto";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

function sanitizeFolder(value: string | null) {
  return (value ?? "media")
    .toLowerCase()
    .replace(/[^a-z0-9/-]/g, "-")
    .replace(/\/+/g, "/")
    .split("/")
    .filter(Boolean)
    .join("/");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fileEntry = formData.get("file");
    const folderEntry = formData.get("folder");
    const folder = sanitizeFolder(typeof folderEntry === "string" ? folderEntry : null);

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ success: false, error: "Missing image file" }, { status: 400 });
    }

    if (!fileEntry.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "Only image files are allowed" }, { status: 400 });
    }

    if (fileEntry.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Image must be under 10MB" }, { status: 413 });
    }

    const imageBuffer = Buffer.from(await fileEntry.arrayBuffer());
    const image = sharp(imageBuffer).rotate().webp({ quality: 82 });
    const outputBuffer = await image.toBuffer();

    const outputFolder = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(outputFolder, { recursive: true });

    const fileName = `${crypto.randomUUID()}.webp`;
    const filePath = path.join(outputFolder, fileName);
    await writeFile(filePath, outputBuffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${folder}/${fileName}`,
      contentType: "image/webp",
      originalName: fileEntry.name,
    });
  } catch (error) {
    console.error("Failed to upload image", error);
    return NextResponse.json({ success: false, error: "Image upload failed" }, { status: 500 });
  }
}
