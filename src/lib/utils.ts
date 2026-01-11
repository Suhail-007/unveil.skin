import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatter utility for currency, date, relative time, and capitalization
export const formatter = {
  currency: function (amount: number | string, currency: string = 'INR'): string {
    const amountNumber = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
    }).format(amountNumber);
  },

  date: function (date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    }).format(dateObj);
  },

  relativeTime: function (date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat('en-IN', { numeric: 'auto' });
    const divisions = [
      { amount: 60, name: 'seconds' },
      { amount: 60, name: 'minutes' },
      { amount: 24, name: 'hours' },
      { amount: 7, name: 'days' },
      { amount: 4.34524, name: 'weeks' },
      { amount: 12, name: 'months' },
      { amount: Number.POSITIVE_INFINITY, name: 'years' },
    ] as const;
    let duration = diffInSeconds;

    for (let i = 0; i < divisions.length; i++) {
      if (Math.abs(duration) < divisions[i].amount) {
        return rtf.format(-Math.round(duration), divisions[i].name as Intl.RelativeTimeFormatUnit);
      }
      duration /= divisions[i].amount;
    }
    return '';
  },

  capitalize: function <T extends string>(text: T): T {
    if (text.length === 0) return text;
    return (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()) as T;
  },
} as const;
