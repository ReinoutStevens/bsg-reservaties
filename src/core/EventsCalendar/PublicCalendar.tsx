import React from 'react';
import EventsCalendar from './EventsCalendar';
import { DateTime } from 'luxon';
import { CalendarEvent } from '../../services/Events';
import EventInfo from './EventInfo';
import withServices, { WithServices } from '../../services/withServices';

type PublicCalendarProps = WithServices


interface PublicCalendarState {
  anchorEl: HTMLElement | null;
  activeEvent: CalendarEvent | null;
}


class PublicCalendar extends React.Component<PublicCalendarProps, PublicCalendarState> {

  constructor(props: PublicCalendarProps) {
    super(props);
    this.state = {
      anchorEl: null,
      activeEvent: null,
    }
  }

  render() {
    return (
      <>
        <EventsCalendar
          events={this.getEvents}
          onEventClick={this.onEventClick}
        />
        {this.renderEventInfo()}
      </>
    );
  }

  private renderEventInfo() {
    const { activeEvent, anchorEl } = this.state;
    if (activeEvent && anchorEl) {
      return (
        <EventInfo
          event={activeEvent}
          onClose={this.onEventInfoClose}
          anchorEl={anchorEl}
          open
        />
      );
    }
    return null;
  }

  private onEventClick = (event: CalendarEvent, el: HTMLElement) => {
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
    return services.events.getAllApprovedEvents(start, end);
  }
}

export default withServices(PublicCalendar);
