import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "./db";
import { users } from "./db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const identifier = credentials.identifier as string;
        const password = credentials.password as string;

        // Search user by email or username
        const [user] = await db
          .select()
          .from(users)
          .where(
            or(
              eq(users.email, identifier),
              eq(users.username, identifier)
            )
          )
          .limit(1);

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);

        if (existingUser) {
          await db
            .update(users)
            .set({
              name: user.name || existingUser.name,
              image: user.image || existingUser.image,
              provider: "google",
            })
            .where(eq(users.email, user.email));

          user.id = existingUser.id;
        } else {
          const username = user.email.split("@")[0] + "_" + Math.random().toString(36).substring(2, 6);
          const [newUser] = await db
            .insert(users)
            .values({
              email: user.email,
              name: user.name,
              image: user.image,
              username: username,
              provider: "google",
            })
            .returning();
          user.id = newUser.id;
        }
      }
      return true;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
    };
  }
}
