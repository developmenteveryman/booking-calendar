import type DateType from '@/domain/models/VenueDate';

// Converts a time duration in seconds to a HH:MM formatted string. Input is number of seconds since midnight
export function secondsToTimeString(seconds: number): string {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours().toString().padStart(2, '0');
  const mm = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

// Generates a descriptive summary for an event date.
export function getDescription(date: DateType | undefined, numCars: number, label: string): string {
  if (!date) return '';
  return `Join us for a Driving Experience day on ${date.formattedDate}${
    date.properties.venue?.description ? ` at ${date.properties.venue.description}` : ''
  } with ${numCars} ${label} from ${date.earliestStartTime} in the morning. The table below shows the days’ timetable and what is available when.`;
}
