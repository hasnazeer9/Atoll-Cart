import fs from "node:fs";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/db";
import { FILE_NAME, MIME } from "@/lib/uploads";

// Serves product images uploaded from the admin portal.
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!FILE_NAME.test(file)) return new Response("Not found", { status: 404 });
  try {
    const data = fs.readFileSync(path.join(UPLOAD_DIR, file));
    return new Response(data, {
      headers: {
        "Content-Type": MIME[file.split(".")[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
