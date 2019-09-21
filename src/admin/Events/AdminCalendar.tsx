import React from 'react';
import { DateTime } from 'luxon';
import NewEventDialog from './NewEventDialog';
import EventsCalendar, { ExtendedCalendarEvent } from '../../core/EventsCalendar/EventsCalendar';
import AdminEventInfo from './AdminEventInfo';
import withServices, { WithServices } from '../../services/withServices';
import NewEventFab from './NewEventFab';
import Skeleton from '@material-ui/lab/Skeleton';
import Rentables, { RentableFilter } from '../../core/Rentables/Rentables';
import { Grid } from '@material-ui/core';

interface EventsState {
  day: DateTime | null;
  dialogOpen: boolean;
  anchorEl: HTMLElement | null;
  activeEvent: ExtendedCalendarEvent | null;
  loading: boolean;
  rentables: RentableFilter[];
}


class AdminCalendar extends React.Component<WithServices, EventsState> {

  constructor(props: WithServices) {
    super(props);
    this.state = {
      day: null,
      dialogOpen: false,
      activeEvent: null,
      anchorEl: null,
      loading: true,
      rentables: [],
    }
  }

  async componentDidMount() {
    const { services } = this.props;
    const rentables = await services.events.getRentables();
    const rentableFilter = rentables.map((r) => Object.assign({}, r, { isActive: true }));
    this.setState({
      loading: false,
      rentables: rentableFilter,
    });
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return this.renderLoading();
    } else {
      return this.renderLoaded();
    }
  }

  private renderLoading() {
    return (
      <Skeleton variant="rect" width="100%" height="100%" />
    )
  }


  private renderLoaded() {
    const { dialogOpen, day, rentables } = this.state;
    const calendarKey = rentables.reduce((total, r) => {
      return r.isActive ? total + 1 : total;
    }, 0);
    return (
      <Grid direction="column" container>
        <Grid item>
          <Rentables rentables={rentables} onClick={this.rentableClicked} />
        </Grid>
        <Grid item>
          <EventsCalendar
            key={calendarKey}
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
        </Grid>
      </Grid>
    );
  }

  private rentableClicked = (id: string) => {
    const { rentables } = this.state;
    const newRentables = rentables.map((rentable) => {
      if (rentable.id !== id) {
        return rentable;
      } else {
        return Object.assign({}, rentable, { isActive: !rentable.isActive });
      }
    });
    this.setState({ rentables: newRentables });
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

  private getEvents = async (start: DateTime, end: DateTime) => {
    const { services } = this.props;
    const { rentables } = this.state;
    const events = await services.events.getAllEvents(start, end);
    return events.filter((ev) => {
      if (!ev.rentable) {
        return true;
      }
      return rentables.filter((r) => r.isActive).find((r) => r.id === ev.rentable!.id);
    })
  }
}

export default withServices(AdminCalendar);
