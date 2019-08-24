import React from 'react';
import { ExtendedCalendarEvent } from './EventsCalendar';
import { CalendarEvent } from '../../services/Events';
import FullCalendar from '@fullcalendar/react';

export interface EventsCalendarContextProps {
  onUpdateEvent: (oldEvent: ExtendedCalendarEvent, event: CalendarEvent) => void;
  onDeleteEvent: (event: ExtendedCalendarEvent) => void;
  onNewEvent: (event: CalendarEvent) => void;
}

const EventsCalendarContext = React.createContext<EventsCalendarContextProps>({
  onUpdateEvent: (old, ev) => { throw new Error('Missing context') },
  onDeleteEvent: (ev) => { throw new Error('Missing context') },
  onNewEvent: (ev) => { throw new Error('Missing context') },
})

export default EventsCalendarContext;
