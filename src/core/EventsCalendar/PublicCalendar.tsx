import React from 'react';
import EventsCalendar from './EventsCalendar';
import { DateTime } from 'luxon';
import BSGServices from '../../services/BSGServices';

const PublicCalendar: React.FC = () => {
  const getEvents = (start: DateTime, end: DateTime) => {
    return BSGServices.getInstance().getAllEvents(start, end);
  }
  return (
    <EventsCalendar events={getEvents} />
  );
}

export default PublicCalendar;
