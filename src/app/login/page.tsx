import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const profile = await getSessionProfile();
  if (profile) {
    redirect(profile.role === "admin" ? "/admin" : "/chapters");
  }

  return <LoginForm />;
}