// src/lib/validation.ts

/**
 * Checks that `name` is non-empty (after trimming).
 * Returns an error message if invalid, or null if valid.
 */
export function validateName(name: string): string | null {
  if (!name.trim()) {
    return "Please enter your full name.";
  }
  return null;
}

/**
 * Basic email‐format check (RFC‐adjacent).
 * Returns an error message if invalid, or null if valid.
 */
export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return "Please enter your email address.";
  }
  // Simple regex for email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return "Please enter a valid email address.";
  }
  return null;
}

/**
 * Enforces password rules:
 *  - at least 8 characters
 *  - one uppercase
 *  - one lowercase
 *  - one digit
 *  - one special character
 *
 * Returns an error message if invalid, or null if valid.
 */
export function validatePasswordRules(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must include at least one digit.";
  }
  if (!/^[A-Za-z0-9!@#$%^&*()_\-+=\[{\]};:'",<.>\/?\\|`~]+$/.test(password)) {
    return "Password must include at least one special character.";
  }
  return null;
}

/**
 * Checks that confirmPassword matches password.
 * Returns an error message if they differ, or null if they match.
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | null {
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return null;
}
