import React from 'react';
import { CalendarEvent } from '../../services/Events';
import { Popover, Card, CardContent, Typography } from '@material-ui/core';

export interface EventInfoProps {
  anchorEl: HTMLElement;
  event: CalendarEvent;
  open: boolean;
  onClose: () => void;
}


class EventInfo extends React.Component<EventInfoProps> {

  render() {
    const { open, onClose, anchorEl } = this.props;
    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {this.renderEvent()}
      </Popover>
    )
  }

  private renderEvent() {
    const { event } = this.props;
    return (
      <Card>
        <CardContent>
          <Typography>
            {event.title}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default EventInfo;
