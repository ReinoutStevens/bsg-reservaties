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
  userId: string;
}

export interface CreateCalendarEventInput {
  day: DateTime;
  title: string;
  description: string | null;
  rentableId?: string;
  url?: string;
  approved: boolean;
  userId: string;
}

export interface UpdateCalendarEventInput {
  id: string;
  day: DateTime;
  title: string;
  description: string | null;
  rentableId?: string;
  url?: string;
  approved: boolean;
  userId: string;
}

export interface ApproveCalendarEventInput {
  id: string;
}
