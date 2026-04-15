import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { startups } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyName, startupId } = await req.json();

  if (!companyName || !startupId) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  await db
    .update(startups)
    .set({ name: companyName, updatedAt: new Date() })
    .where(eq(startups.id, startupId));

  return Response.json({ success: true });
}
