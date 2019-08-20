import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DateTime } from 'luxon';
import { EventSourceFunc } from '@fullcalendar/core/event-sources/func-event-source';
import { OptionsInput, EventApi } from '@fullcalendar/core';
import { CalendarEvent } from '../../services/Events';

import './EventsCalendar.scss';

export type ExtendedCalendarEvent = CalendarEvent & { baseEvent: EventApi };

export interface EventsCalenderProps {
  calendarProps?: Partial<OptionsInput>;
  events: (from: DateTime, to: DateTime) => Promise<CalendarEvent[]>
  onEventClick?: (event: ExtendedCalendarEvent, anchor: HTMLElement) => void;
}

class EventsCalendar extends React.Component<EventsCalenderProps> {

  calendarComponentRef = React.createRef<FullCalendar>()

  render() {
    return (
      <>
        {this.renderCalendar()}
      </>
    )
  }

  private renderCalendar() {
    const { calendarProps } = this.props;
    return (
      <div className='calendar'>
        <FullCalendar
          defaultView="dayGridMonth"
          header={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          ref={this.calendarComponentRef}
          events={this.getEvents}
          eventClick={this.onEventClick}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false,
          }}
          {...calendarProps}
        />
      </div>
    );
  }

  private getEvents: EventSourceFunc = (arg: {
    start: Date;
    end: Date;
    timeZone: string;
  }, success, failure) => {
    const fromDate = DateTime.fromJSDate(arg.start);
    const toDate = DateTime.fromJSDate(arg.end);
    const { events } = this.props;
    events(fromDate, toDate).then((events) => {
      const mappedEvents = events.map((ev) => ({
        ...ev,
        start: ev.start.toJSDate(),
        end: ev.end.toJSDate(),
      }));
      success(mappedEvents);
      return mappedEvents;
    }).catch((e) => {
      failure(e);
      return [];
    });
  }

  private onEventClick = (arg: {
    event: EventApi,
    el: HTMLElement,
    jsEvent: MouseEvent,
  }) => {
    const { onEventClick } = this.props;
    arg.jsEvent.preventDefault();
    if (!onEventClick) {
      return;
    }
    const { event, el } = arg;
    const ev: ExtendedCalendarEvent = {
      start: DateTime.fromJSDate(event.start || new Date()),
      end: DateTime.fromJSDate(event.end || new Date()),
      title: event.title,
      description: event.extendedProps.description,
      url: event.url,
      id: event.id,
      rentable: event.extendedProps.rentable,
      approved: event.extendedProps.approved,
      baseEvent: event,
    }
    onEventClick(ev, el);
  }
}

export default EventsCalendar;
