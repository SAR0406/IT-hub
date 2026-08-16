import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { RegisterForm } from "./RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function RegisterPage() {
  const profile = await getSessionProfile();
  if (profile) {
    redirect(profile.role === "admin" ? "/admin" : "/chapters");
  }

  return <RegisterForm />;
}