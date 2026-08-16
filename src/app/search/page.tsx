import { requireUser } from "@/lib/auth";
import SearchClient from "./SearchClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Find notes, worksheets, practicals and question papers across every unit.",
};

export default async function SearchPage() {
  await requireUser();
  return <SearchClient />;
}