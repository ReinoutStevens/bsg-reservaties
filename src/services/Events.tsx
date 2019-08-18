import { DateTime } from 'luxon';
export interface CalendarEvent {
  id: string;
  start: DateTime;
  end: DateTime;
  title: string;
  description: string | null;
  approved: boolean;
  rentableId?: string;
  url?: string;
}

export interface CreateCalendarEventInput {
  start: DateTime;
  end: DateTime;
  title: string;
  description: string | null;
  rentableId?: string;
  url?: string;
}
