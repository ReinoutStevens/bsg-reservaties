import React from 'react';
import { CalendarEvent } from '../../services/Events';
import withServices, { WithServices } from '../../services/withServices';
import { createStyles, Theme, withStyles, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import Spinner from '../../core/Spinner';
import EventRow from './EventRow';

export interface UnapprovedEventsProps {
}

export interface UnapprovedEventsState {
  events: CalendarEvent[];
  loading: boolean;
}

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
});


type UnapprovedEventsProps_ = UnapprovedEventsProps & WithServices & WithStyles<typeof styles>;

class UnapprovedEvents extends React.Component<UnapprovedEventsProps_, UnapprovedEventsState> {
  constructor(props: UnapprovedEventsProps_) {
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
    const { loading, events } = this.state;
    if (loading) {
      return <Spinner />
    }
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                onApprove={this.removeEvent}
                onDelete={this.removeEvent}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
  }

  private async loadEvents() {
    const { services } = this.props;
    const events = await services.events.getUnapprovedEvents();
    this.setState({ events: events, loading: false });
  }

  private removeEvent = (event: CalendarEvent) => {
    const { events } = this.state;
    this.setState({ events: events.filter((ev) => event.id !== ev.id) });
  }
}

export default withStyles(styles)(withServices(UnapprovedEvents));
