import React from 'react';
import { DateTime } from 'luxon';
import NewEventDialog from './NewEventDialog';
import EventsCalendar, { ExtendedCalendarEvent } from '../../core/EventsCalendar/EventsCalendar';
import AdminEventInfo from './AdminEventInfo';
import withServices, { WithServices } from '../../services/withServices';
import NewEventFab from './NewEventFab';

interface EventsState {
  day: DateTime | null;
  dialogOpen: boolean;
  anchorEl: HTMLElement | null;
  activeEvent: ExtendedCalendarEvent | null;
}


class AdminCalendar extends React.Component<WithServices, EventsState> {

  constructor(props: WithServices) {
    super(props);
    this.state = {
      day: null,
      dialogOpen: false,
      activeEvent: null,
      anchorEl: null,
    }
  }


  render() {
    const { dialogOpen, day } = this.state;
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
          day={day}
          onClose={this.onDialogClose}
        />
        <NewEventFab />
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
    const { date } = arg;
    const day = DateTime.fromJSDate(date);
    this.setState({
      day: day,
      dialogOpen: true,
    });
  }

  private handleDateSelect = (arg: {
    start: Date;
  }) => {
    const { start } = arg;
    this.setState({
      day: DateTime.fromJSDate(start).startOf('day'),
      dialogOpen: true,
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
