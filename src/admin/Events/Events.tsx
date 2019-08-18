import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import BSGServices from '../../services/BSGServices';
import { DateTime } from 'luxon';
import NewEventDialog from './NewEventDialog';
import { EventSourceFunc } from '@fullcalendar/core/event-sources/func-event-source';

interface EventsState {
  start: DateTime | null;
  end: DateTime | null;
  allDay: boolean;
  dialogOpen: boolean;
}

class Events extends React.Component<{}, EventsState> {

  calendarComponentRef = React.createRef<FullCalendar>()

  constructor(props: {}) {
    super(props)
    this.state = {
      start: null,
      end: null,
      dialogOpen: false,
      allDay: false,
    }
  }


  render() {
    const { dialogOpen, start, end, allDay } = this.state;
    (console).log('from', start);
    return (
      <div className='admin-calendar'>
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
          selectable
          selectConstraint={{
            start: '00:01',
            end: '23:59',
          }}
          dateClick={this.handleDateClick}
          select={this.handleDateSelect}
        />
        <NewEventDialog
          open={dialogOpen}
          start={start}
          end={end}
          onClose={this.onDialogClose}
          allDay={allDay}
        />
      </div>
    )
  }


  handleDateClick = (arg: {
    date: Date;
    allDay: boolean;
  }) => {
    const { date, allDay } = arg;
    this.setState({
      start: DateTime.fromJSDate(date),
      dialogOpen: true,
      allDay: allDay,
    });
  }

  handleDateSelect = (arg: {
    start: Date;
    end: Date;
    allDay: boolean;
  }) => {
    const { start, end, allDay } = arg;
    this.setState({
      start: DateTime.fromJSDate(start),
      end: DateTime.fromJSDate(end),
      dialogOpen: true,
      allDay: allDay,
    });
  }

  private onDialogClose = () => {
    this.setState({
      dialogOpen: false,
    })
  }

  private getEvents: EventSourceFunc = (arg: {
    start: Date;
    end: Date;
    timeZone: string;
  }, success, failure) => {
    const fromDate = DateTime.fromJSDate(arg.start);
    const toDate = DateTime.fromJSDate(arg.end);
    return BSGServices.getInstance().getAllEvents(fromDate, toDate).then((events) => {
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
}

export default Events;
