import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as Indian Rupees (INR) using the Indian numbering system and the ₹ symbol.
 * Manually prepends the ₹ symbol to ensure it renders correctly regardless of browser locale quirks.
 */
export function formatINR(amount: number) {
  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `₹${formatter.format(amount)}`;
}
