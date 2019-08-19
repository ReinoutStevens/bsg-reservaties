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

export interface EventsCalenderProps {
  calendarProps?: Partial<OptionsInput>;
  events: (from: DateTime, to: DateTime) => Promise<CalendarEvent[]>
  onEventClick?: (event: CalendarEvent, anchor: HTMLElement) => void;
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
    if (!onEventClick) {
      return;
    }
    const { event, el, jsEvent } = arg;
    const ev: CalendarEvent = {
      start: DateTime.fromJSDate(event.start || new Date()),
      end: DateTime.fromJSDate(event.end || new Date()),
      title: event.title,
      description: event.extendedProps.description,
      url: event.url,
      id: event.id,
      rentableId: event.extendedProps.rentableId,
      approved: event.extendedProps.approved,
    }
    jsEvent.preventDefault();
    onEventClick(ev, el);
  }
}

export default EventsCalendar;
