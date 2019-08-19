import React from 'react';
import { CalendarEvent } from '../../services/Events';
import { Popover, Card, CardContent, Typography, Theme, createStyles, CardHeader, CardActions, IconButton, Link } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import { WithStyles, withStyles } from '@material-ui/styles';

const styles = (theme: Theme) => createStyles({
  button: {
    margin: theme.spacing(1),
  },
});

export interface EventInfoProps {
  anchorEl: HTMLElement;
  event: CalendarEvent;
  open: boolean;
  onClose: () => void;
}

type EventInfoProps_ = EventInfoProps & WithStyles<typeof styles>;

class EventInfo extends React.Component<EventInfoProps_> {

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
    const { event, classes } = this.props;
    const dateFormat = {
      weekday: undefined,
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return (
      <Card>
        <CardHeader
          title={event.title}
          subheader={`${event.start.toLocaleString(dateFormat)} ⋅ ${event.end.toLocaleString(dateFormat)}`}
        />
        <CardContent>
          {this.renderEventLocation()}
          <Typography variant="body2">
            {event.description}
          </Typography>
        </CardContent>
        {this.renderActions()}
      </Card>
    );
  }

  private renderEventLocation() {
    const { event } = this.props;
    if (!event.rentableId) {
      return null;
    }
    return (
      <>
        <LocationOnIcon />
        <Typography>{event.rentableId}</Typography>
      </>
    );
  }

  private renderActions() {
    return (
      <CardActions disableSpacing>
        {this.renderUrlAction()}
      </CardActions>
    )
  }

  private renderUrlAction() {
    const { event, classes } = this.props;
    if (!event.url) {
      return null;
    }
    return (
      <Link href={event.url} target="_blank" underline="none" >
        <IconButton className={classes.button}>
          <OpenInBrowserIcon />
        </IconButton>
      </Link>
    );
  }
}

export default withStyles(styles)(EventInfo);
