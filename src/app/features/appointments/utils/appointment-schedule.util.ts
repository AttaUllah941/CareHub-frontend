/** Combines a calendar date with a slot like "04:30 PM" into a future ISO date-time. */
export function combineDateAndTimeSlot(date: Date, timeSlot: string): string {
  const scheduled = new Date(date);
  const match = timeSlot.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    scheduled.setDate(scheduled.getDate() + 1);
    scheduled.setHours(10, 0, 0, 0);
  } else {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();

    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    scheduled.setHours(hours, minutes, 0, 0);
  }

  const now = new Date();
  if (scheduled <= now) {
    scheduled.setDate(scheduled.getDate() + 1);
  }

  return scheduled.toISOString();
}

export function formatAppointmentDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleString('en-PK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
