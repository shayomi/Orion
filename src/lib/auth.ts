import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

       if (token.id && (user || !token.role || !token.status)) {
        const [dbUser] = await db
          .select({ role: users.role, status: users.status })
          .from(users)
          .where(eq(users.id, token.id as string))
          .limit(1);

        token.role = dbUser?.role ?? "member";
        token.status = dbUser?.status ?? "active";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "member" | "admin") ?? "member";
        session.user.status = (token.status as "active" | "suspended") ?? "active";
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Protected routes
      const isAppRoute =
        pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");
      const isAdminCreate = pathname === "/admin/create";
      const isAdminRoute = pathname.startsWith("/admin") && !isAdminCreate;
      const isAuthRoute =
        pathname.startsWith("/login") || pathname.startsWith("/signup");
      const isActiveAdmin =
        auth?.user?.role === "admin" && auth.user.status === "active";

      if (isAppRoute && !isLoggedIn) {
        return Response.redirect(new URL("/login", request.url));
      }

      // /admin/create is public (self-locking via page logic)
      if (isAdminRoute && !isLoggedIn) {
        return Response.redirect(new URL("/login", request.url));
      }

      if (isAdminRoute && !isActiveAdmin) {
        return Response.redirect(new URL("/dashboard", request.url));
      }

      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", request.url));
      }

      return true;
    },
  },
});
