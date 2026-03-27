import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dns from "node:dns";

// Fix for potential DNS issues on certain networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnect();

        // Find user and explicitly include password for comparison
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("No user found with this email");
        }

        // --- VERIFICATION CHECK ---
        if (!user.isVerified) {
          // This specific string will be caught by the frontend
          throw new Error("ACCOUNT_NOT_VERIFIED");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password!);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return { 
          id: user._id.toString(), 
          email: user.email, 
          role: user.role 
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin", // Custom sign-in page route
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
