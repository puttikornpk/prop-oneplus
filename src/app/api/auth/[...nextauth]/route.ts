
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

console.error("[Auth_Debug] NextAuth Route Handler Loaded");

export { handler as GET, handler as POST };
