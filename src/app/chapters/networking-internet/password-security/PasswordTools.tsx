"use client";

import { useState } from "react";

const CHECKLIST_ITEMS = [
  { id: 1, text: "At least 12 characters long", weight: 2 },
  { id: 2, text: "Mix of uppercase and lowercase letters", weight: 1 },
  { id: 3, text: "Includes numbers (0-9)", weight: 1 },
  { id: 4, text: "Includes special symbols (!@#$%^&*)", weight: 2 },
  { id: 5, text: "No dictionary words or common patterns", weight: 3 },
  { id: 6, text: "No personal info (name, birthdate, phone)", weight: 3 },
  { id: 7, text: "Unique — not reused on other sites", weight: 3 },
  { id: 8, text: "Stored in a password manager", weight: 2 },
  { id: 9, text: "Multi-factor authentication enabled", weight: 3 },
  { id: 10, text: "Changed after known breaches", weight: 2 },
];

const STRENGTH_LABELS = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];

function checkStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  if (!/(.)\1{2,}/.test(password)) strength++;
  return strength;
}

export function PasswordTools() {
  const [checked, setChecked] = useState<number[]>([]);
  const [customPassword, setCustomPassword] = useState("");

  const toggleCheck = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const score = checked.reduce((sum, id) => {
    const item = CHECKLIST_ITEMS.find((i) => i.id === id);
    return sum + (item?.weight ?? 0);
  }, 0);
  const maxScore = CHECKLIST_ITEMS.reduce((sum, item) => sum + item.weight, 0);
  const percentage = Math.round((score / maxScore) * 100);

  const customStrength = checkStrength(customPassword);
  const strengthColor =
    customStrength >= 5
      ? "bg-emerald-500"
      : customStrength === 4
        ? "bg-green-500"
        : customStrength === 3
          ? "bg-lime-500"
          : customStrength === 2
            ? "bg-yellow-500"
            : customStrength === 1
              ? "bg-orange-500"
              : "bg-red-500";

  return (
    <>
      <section>
        <h2 className="font-mono text-sm text-brand mb-4">
          Interactive Password Strength Checker
        </h2>
        <div className="p-4 rounded-lg border border-zinc-200 bg-white">
          <label htmlFor="password-tester" className="block text-sm font-medium text-ink mb-2">
            Test a password (never enter real passwords!):
          </label>
          <input
            id="password-tester"
            type="text"
            value={customPassword}
            onChange={(event) => setCustomPassword(event.target.value)}
            placeholder="Enter a test password..."
            className="w-full border rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-ink">
                Strength: {STRENGTH_LABELS[customStrength] ?? "Very Weak"}
              </span>
              <span className="text-sm text-slate-500">{customStrength}/6</span>
            </div>
            <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthColor} transition-all duration-300`}
                style={{ width: `${((customStrength + 1) / 6) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Note: This runs locally in your browser. No data is sent anywhere.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-mono text-sm text-brand mb-4">Password Security Checklist</h2>
        <p className="text-slate-600 mb-4">
          Check each item that applies to your current password practices.
          Score: <strong className="text-ink">{score}/{maxScore} ({percentage}%)</strong>
        </p>
        <div className="p-4 rounded-lg border border-zinc-200 bg-white">
          <div className="h-3 bg-zinc-200 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full transition-all duration-300 ${
                percentage >= 80
                  ? "bg-green-500"
                  : percentage >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <ul className="space-y-2">
            {CHECKLIST_ITEMS.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 hover:border-brand/40 transition-colors"
              >
                <input
                  type="checkbox"
                  id={`check-${item.id}`}
                  checked={checked.includes(item.id)}
                  onChange={() => toggleCheck(item.id)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-brand focus:ring-brand focus:ring-2"
                />
                <label
                  htmlFor={`check-${item.id}`}
                  className="flex-1 cursor-pointer text-sm text-slate-600"
                >
                  {item.text}
                  <span className="ml-2 text-xs font-mono text-slate-400">(+{item.weight})</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 rounded-lg bg-brand-soft border border-brand/20">
            <p className="text-sm text-brand font-medium">
              {percentage >= 80
                ? "Excellent! Your password hygiene is strong."
                : percentage >= 60
                  ? "Good start. Review unchecked items to improve."
                  : "Needs improvement. Focus on high-weight items first."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
