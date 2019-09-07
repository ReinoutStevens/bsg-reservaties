import React from 'react';
import { CalendarEvent } from '../../services/Events';
import { TableRow, TableCell, IconButton } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import withServices, { WithServices } from '../../services/withServices';
import formatDate from '../../util/dateFormat';

export interface EventRowProps {
  event: CalendarEvent;
  onDelete?: (event: CalendarEvent) => void;
  onApprove?: (event: CalendarEvent) => void;
}

export interface EventRowState {
  processing: boolean;
}

type EventRowProps_ = EventRowProps & WithServices;

class EventRow extends React.Component<EventRowProps_, EventRowState> {

  constructor(props: EventRowProps_) {
    super(props);
    this.state = {
      processing: false,
    };
  }

  render() {
    const { event } = this.props;
    return (
      <TableRow key={event.id}>
        <TableCell component="th" scope="row">
          {event.title}
        </TableCell>
        <TableCell>{event.rentable ? event.rentable.name : '/'}</TableCell>
        <TableCell>{formatDate(event.start)}</TableCell>
        <TableCell>{formatDate(event.end)}</TableCell>
        <TableCell align="right">{this.renderActions()}</TableCell>
      </TableRow>
    );
  }

  private renderActions() {
    const { processing } = this.state;
    if (processing) {
      return;
    }
    return (
      <div>
        <IconButton onClick={this.approve} size="small">
          <DoneIcon />
        </IconButton>
        <IconButton onClick={this.delete} size="small">
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }

  private delete = async () => {
    this.setState({ processing: true });
    const { services, event, onDelete } = this.props;
    await services.events.deleteEvent(event.id);
    if (onDelete) {
      onDelete(event);
    }
  }

  private approve = async () => {
    this.setState({ processing: true });
    const { services, event, onApprove } = this.props;
    await services.events.approveEvent({ id: event.id });
    if (onApprove) {
      onApprove(event);
    }
  }
}

export default withServices(EventRow);
