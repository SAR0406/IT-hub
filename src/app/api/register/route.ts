import { NextResponse } from "next/server";
import { registerStudent } from "@/lib/students";
import { validatePassword } from "@/lib/password";

/**
 * POST /api/register — self-service account request.
 *
 * The account is created by the service role (no SMTP/confirmation email
 * needed) but stays inactive until the teacher activates it from the
 * students panel. Until then the student cannot sign in.
 */

const NAME_MAX = 80;
const EMAIL_MAX = 200;
const CLASS_MAX = 40;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { fullName, email, password, className } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof fullName !== "string" ||
    fullName.trim().length < 2 ||
    fullName.length > NAME_MAX
  ) {
    return NextResponse.json({ error: "Please enter your full name (2–80 characters)." }, { status: 400 });
  }
  if (
    typeof email !== "string" ||
    email.length > EMAIL_MAX ||
    !EMAIL_RE.test(email.trim())
  ) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (typeof password !== "string") {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }
  if (className !== undefined && className !== null && typeof className !== "string") {
    return NextResponse.json({ error: "Invalid class name." }, { status: 400 });
  }
  if (typeof className === "string" && className.length > CLASS_MAX) {
    return NextResponse.json({ error: "Class name is too long." }, { status: 400 });
  }

  let result;
  try {
    result = await registerStudent({
      fullName,
      email,
      password,
      className: typeof className === "string" ? className : null,
    });
  } catch {
    return NextResponse.json(
      { error: "The account could not be created right now. Please try again." },
      { status: 500 }
    );
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}