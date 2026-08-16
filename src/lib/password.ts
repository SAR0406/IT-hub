/**
 * Single source of truth for the account password policy.
 * Supabase's own default is 6+ characters; this app requires more.
 */

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

const HAS_LETTER = /[a-zA-Z]/;
const HAS_DIGIT = /\d/;

/** Returns a human-readable problem with the password, or null when it is acceptable. */
export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`;
  }
  if (!HAS_LETTER.test(password)) {
    return "Password must include at least one letter.";
  }
  if (!HAS_DIGIT.test(password)) {
    return "Password must include at least one number.";
  }
  return null;
}

/** Client-side mirror of the same rules, for instant feedback in forms. */
export function passwordChecks(password: string): {
  length: boolean;
  letter: boolean;
  digit: boolean;
} {
  return {
    length: password.length >= PASSWORD_MIN_LENGTH,
    letter: HAS_LETTER.test(password),
    digit: HAS_DIGIT.test(password),
  };
}