import type { Metadata } from "next";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ActivityTracker } from "@/components/ActivityTracker";
import { getSessionProfile } from "@/lib/auth";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IT Hub 11 — Class 11 Information Technology",
    template: "%s | IT Hub 11",
  },
  description:
    "All your Class 11 Information Technology study material in one place. Notes, worksheets, question papers and practicals.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const profile = await getSessionProfile();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar profile={profile} />
        <main className="flex-1">{children}</main>
        <Footer />
        {profile && <ActivityTracker />}
      </body>
    </html>
  );
}