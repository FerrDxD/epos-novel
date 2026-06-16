import { db } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    // Check if user already exists by email or username
    const existingUser = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, email),
          eq(users.username, username)
        )
      )
      .limit(1);

    if (existingUser.length > 0) {
      const isEmailTaken = existingUser[0].email === email;
      return NextResponse.json(
        {
          message: isEmailTaken
            ? "Email sudah terdaftar."
            : "Username sudah digunakan.",
        },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await db.insert(users).values({
      name,
      username,
      email,
      password: hashedPassword,
      provider: "credentials",
    });

    return NextResponse.json(
      { message: "Registrasi berhasil." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
