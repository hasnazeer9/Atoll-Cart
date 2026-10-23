import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { UPLOAD_DIR } from "./db";

const MAX_BYTES = 5 * 1024 * 1024;

// Decide the real file type from the first bytes, not from the file name or
// the browser-supplied type (both can be faked).
function sniff(buf: Buffer): "jpg" | "png" | "webp" | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.length > 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  return null;
}

export const FILE_NAME = /^[a-f0-9]{32}\.(jpg|png|webp)$/;
export const MIME: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

// Returns the public path of the saved image, or an error message.
export async function saveUpload(file: File): Promise<{ path: string } | { error: string }> {
  if (file.size > MAX_BYTES) return { error: "Image is larger than 5 MB." };
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = sniff(buf);
  if (!ext) return { error: "Image must be a JPG, PNG or WebP file." };
  const name = `${randomBytes(16).toString("hex")}.${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buf);
  return { path: `/uploads/${name}` };
}
