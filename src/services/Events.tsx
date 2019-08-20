import { DateTime } from 'luxon';
import { Rentable } from './Rentable';
export interface CalendarEvent {
  id: string;
  start: DateTime;
  end: DateTime;
  title: string;
  description: string | null;
  approved: boolean;
  rentable?: Rentable;
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
