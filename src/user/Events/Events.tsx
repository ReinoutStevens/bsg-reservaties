import React from 'react';
import { CalendarEvent } from '../../services/Events';

export interface EventsProps {
  events: CalendarEvent[];
}

const Events: React.FC<EventsProps> = ({ events }) => {
  return (
    <>
    </>
  );
}

export default Events;
