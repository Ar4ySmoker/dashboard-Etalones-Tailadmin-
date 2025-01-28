// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    picture?: string | null;
    managerName?: string
  }
}
