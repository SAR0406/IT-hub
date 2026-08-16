import "./concepts.css";

/**
 * Wraps the three homepage art-direction studies. They are intentionally
 * chrome-free (the root layout's AppChrome hides nav/footer/tracker on
 * /concepts) and standalone: static data only, no auth, no database.
 */
export default function ConceptsLayout({ children }: LayoutProps<"/concepts">) {
  return <>{children}</>;
}