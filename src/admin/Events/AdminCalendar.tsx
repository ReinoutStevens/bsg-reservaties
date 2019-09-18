import React from 'react';
import { DateTime } from 'luxon';
import NewEventDialog from './NewEventDialog';
import EventsCalendar, { ExtendedCalendarEvent } from '../../core/EventsCalendar/EventsCalendar';
import AdminEventInfo from './AdminEventInfo';
import withServices, { WithServices } from '../../services/withServices';

interface EventsState {
  start: DateTime | null;
  end: DateTime | null;
  allDay: boolean;
  dialogOpen: boolean;
  anchorEl: HTMLElement | null;
  activeEvent: ExtendedCalendarEvent | null;
}


class AdminCalendar extends React.Component<WithServices, EventsState> {

  constructor(props: WithServices) {
    super(props);
    this.state = {
      start: null,
      end: null,
      dialogOpen: false,
      allDay: false,
      activeEvent: null,
      anchorEl: null,
    }
  }


  render() {
    const { dialogOpen, start, end, allDay } = this.state;
    return (
      <EventsCalendar
        events={this.getEvents}
        calendarProps={
          {
            selectable: true,
            selectConstraint: {
              start: '00:01',
              end: '23:59',
            },
            dateClick: this.handleDateClick,
            select: this.handleDateSelect,
          }
        }
        onEventClick={this.onEventClick}
      >
        {this.renderEventInfo()}
        <NewEventDialog
          open={dialogOpen}
          start={start}
          end={end}
          onClose={this.onDialogClose}
          allDay={allDay}
        />
      </ EventsCalendar>
    );
  }

  private renderEventInfo() {
    const { activeEvent, anchorEl } = this.state;
    if (activeEvent && anchorEl) {
      return (
        <AdminEventInfo
          event={activeEvent}
          onClose={this.onEventInfoClose}
          anchorEl={anchorEl}
          open
        />
      );
    }
    return null;
  }

  private handleDateClick = (arg: {
    date: Date;
    allDay: boolean;
  }) => {
    const { date, allDay } = arg;
    const start = DateTime.fromJSDate(date);
    this.setState({
      start: start.set({ hour: 20 }),
      dialogOpen: true,
      allDay: allDay,
    });
  }

  private handleDateSelect = (arg: {
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

  private onEventClick = (event: ExtendedCalendarEvent, el: HTMLElement) => {
    this.setState({
      activeEvent: event,
      anchorEl: el,
    });
  }

  private onEventInfoClose = () => {
    this.setState({
      anchorEl: null,
      activeEvent: null,
    });
  }

  private getEvents = (start: DateTime, end: DateTime) => {
    const { services } = this.props;
    return services.events.getAllEvents(start, end);
  }
}

export default withServices(AdminCalendar);
