import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "./env";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: env.resolvedGoogleId,
      clientSecret: env.resolvedGoogleSecret,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
