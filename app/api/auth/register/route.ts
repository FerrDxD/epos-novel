import { db } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { registerSchema, formatZodError } from "../../../../lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: formatZodError(parsed.error) }, { status: 400 });
    }
    const { name, username, email, password } = parsed.data;

    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1);

    if (existingUser.length > 0) {
      const isEmailTaken = existingUser[0].email === email;
      return NextResponse.json(
        { message: isEmailTaken ? "Email sudah terdaftar." : "Username sudah digunakan." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      username,
      email,
      password: hashedPassword,
      provider: "credentials",
    });

    return NextResponse.json({ message: "Registrasi berhasil." }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan internal server." }, { status: 500 });
  }
}
