const STORAGE_KEY = "invoice-generator:last-memo-number";

function readLastMemoNumber(): number {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? Number(stored) : 0;
  } catch {
    return 0;
  }
}

function writeLastMemoNumber(value: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // localStorage unavailable (private mode, disabled cookies, etc.) —
    // the memo number simply won't be remembered across visits.
  }
}

/**
 * Returns the next memo number in sequence (1, 2, 3, ...), continuing from
 * the last one issued (as remembered in localStorage), then stores it as
 * the new "last memo number" for next time.
 */
export function generateMemoNo(prefix: string): string {
  const next = readLastMemoNumber() + 1;
  writeLastMemoNumber(next);
  return `${prefix}${next}`;
}
