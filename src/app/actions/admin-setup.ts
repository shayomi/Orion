"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export type SetupState = { error: string | null; success: boolean };

export async function hasAdminUser(): Promise<boolean> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.role, "admin"));

  return row.count > 0;
}

export async function createBootstrapAdmin(
  _prev: SetupState,
  formData: FormData
): Promise<SetupState> {
  // Check if admin already exists
  const adminExists = await hasAdminUser();
  if (adminExists) {
    return { error: "An admin account already exists. This page is locked.", success: false };
  }

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return { error: "All fields are required.", success: false };
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!trimmedName || trimmedName.length < 2) {
    return { error: "Name must be at least 2 characters.", success: false };
  }

  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { error: "Please enter a valid email address.", success: false };
  }

  if (trimmedPassword.length < 8) {
    return { error: "Password must be at least 8 characters.", success: false };
  }

  if (trimmedPassword !== confirmPassword.trim()) {
    return { error: "Passwords do not match.", success: false };
  }

  // Check if email is already taken
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, trimmedEmail))
    .limit(1);

  if (existing) {
    return { error: "An account with this email already exists.", success: false };
  }

  const passwordHash = await bcrypt.hash(trimmedPassword, 12);

  await db.insert(users).values({
    name: trimmedName,
    email: trimmedEmail,
    passwordHash,
    role: "admin",
    status: "active",
  });

  return { error: null, success: true };
}
