import { Geist, IBM_Plex_Mono } from "next/font/google";
import "./concepts.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

/**
 * Wraps the three homepage art-direction studies. They are intentionally
 * chrome-free (the root layout's AppChrome hides nav/footer/tracker on
 * /concepts) and standalone: static data only, no auth, no database.
 */
export default function ConceptsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${geist.variable} ${ibmPlexMono.variable}`}>{children}</div>;
}