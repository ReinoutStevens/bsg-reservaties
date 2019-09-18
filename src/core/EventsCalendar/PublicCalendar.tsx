import React from 'react';
import EventsCalendar from './EventsCalendar';
import { DateTime } from 'luxon';
import { CalendarEvent } from '../../services/Events';
import EventInfo from './EventInfo';
import withServices, { WithServices } from '../../services/withServices';
import Rentables, { RentableFilter } from '../Rentables/Rentables';
import Skeleton from '@material-ui/lab/Skeleton';
import { Grid } from '@material-ui/core';

type PublicCalendarProps = WithServices


interface PublicCalendarState {
  anchorEl: HTMLElement | null;
  activeEvent: CalendarEvent | null;
  rentables: RentableFilter[];
  loading: boolean;
}


class PublicCalendar extends React.Component<PublicCalendarProps, PublicCalendarState> {

  constructor(props: PublicCalendarProps) {
    super(props);
    this.state = {
      anchorEl: null,
      activeEvent: null,
      rentables: [],
      loading: true,
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
    const { rentables } = this.state;
    const calendarKey = rentables.reduce((total, r) => {
      return r.isActive ? total + 1 : total;
    }, 0);
    return (
      <>
        <Grid direction="column" container>
          <Grid item>
            <Rentables rentables={rentables} onClick={this.rentableClicked} />
          </Grid>
          <Grid item>
            <EventsCalendar
              events={this.getEvents}
              onEventClick={this.onEventClick}
              key={calendarKey.toString()}
            />
          </Grid>
        </Grid>
        {this.renderEventInfo()}
      </>
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

  private getEvents = async (start: DateTime, end: DateTime) => {
    const { services } = this.props;
    const { rentables } = this.state;
    const events = await services.events.getAllApprovedEvents(start, end);
    return events.filter((ev) => {
      if (!ev.rentable) {
        return true;
      }
      return rentables.filter((r) => r.isActive).find((r) => r.id === ev.rentable!.id);
    })
  }
}

export default withServices(PublicCalendar);
