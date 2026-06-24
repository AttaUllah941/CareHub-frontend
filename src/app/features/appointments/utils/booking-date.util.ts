export interface BookingDateOption {
  label: string;
  day: number;
  date: Date;
  isToday: boolean;
}

/** Builds consecutive day options for booking date pickers (default: 14 days). */
export function buildBookingDateOptions(dayCount = 14): BookingDateOption[] {
  const options: BookingDateOption[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < dayCount; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    options.push({
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      day: date.getDate(),
      date,
      isToday: i === 0,
    });
  }

  return options;
}
