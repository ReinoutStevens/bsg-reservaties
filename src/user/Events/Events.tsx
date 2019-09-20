import React from 'react';
import { CalendarEvent } from '../../services/Events';
import withServices, { WithServices } from '../../services/withServices';
import { createStyles, Theme, withStyles, Table, TableHead, TableRow, TableCell, TableBody, Container, Typography } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import Spinner from '../../core/Spinner';
import EventRow from './EventRow';
import withFirebase, { WithFirebase } from '../../core/Session/withFirebase';
import { DateTime } from 'luxon';
import NewEventFab from './NewEventFab';

export interface EventsProps {
}

export interface EventsState {
  events: CalendarEvent[];
  loading: boolean;
}

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});


type EventsProps_ = EventsProps & WithServices & WithStyles<typeof styles> & WithFirebase;

class Events extends React.Component<EventsProps_, EventsState> {
  constructor(props: EventsProps_) {
    super(props);
    this.state = {
      events: [],
      loading: true,
    }
  }

  componentDidMount() {
    this.loadEvents();
  }

  render() {
    const { classes } = this.props
    return (
      <>
        <Container>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              My Upcoming Events
          </Typography>
            {this.renderEvents()}
          </div>
        </Container>
        <NewEventFab />
      </>
    )
  }

  private renderEvents() {
    const { classes } = this.props;
    const { loading, events } = this.state;
    if (loading) {
      return <Spinner />
    }
    return (
      <div className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                onDelete={this.removeEvent}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    )

  }

  private async loadEvents() {
    const { services, currentUser } = this.props;
    const yesterday = DateTime.local().plus({ day: -1 }).startOf('day');
    const events = await services.events.getUserEvents(currentUser!.uid, yesterday);
    this.setState({ events: events, loading: false });
  }

  private removeEvent = (event: CalendarEvent) => {
    const { events } = this.state;
    this.setState({ events: events.filter((ev) => event.id !== ev.id) });
  }
}

export default withStyles(styles)(withFirebase(withServices(Events)));
