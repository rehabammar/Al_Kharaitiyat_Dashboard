// financial-transactions.model.ts (top of file)
export type DateInput = string | number | Date | null | undefined;

export function toDate(input: DateInput): Date | null {
  if (input == null) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  if (typeof input === 'number') {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(String(input).trim());
  return isNaN(d.getTime()) ? null : d;
}
 

/** Format as MM/dd/yyyy hh:mm a (e.g., 07/14/2025 09:49 PM) with a specific TZ */
export function formatUsDateTime(
  date: Date | null,
  timeZone = 'Africa/Cairo',
  locale = 'en-US'
): string {
  if (!date) return '—';
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date);

  const get = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find(p => p.type === t)?.value ?? '';

  // No comma, fixed order
  return `${get('month')}/${get('day')}/${get('year')} ${get('hour')}:${get('minute')} ${get('dayPeriod')}`.trim();
}
