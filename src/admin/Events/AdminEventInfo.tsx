import React from 'react';
import { Popover, Card, CardContent, Typography, Theme, createStyles, CardHeader, CardActions, IconButton, Link, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import DeleteIcon from '@material-ui/icons/Delete';
import { WithStyles, withStyles } from '@material-ui/styles';
import BSGServices from '../../services/BSGServices';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { ExtendedCalendarEvent } from '../../core/EventsCalendar/EventsCalendar';

const styles = (theme: Theme) => createStyles({
  button: {
    margin: theme.spacing(1),
  },
  adminButton: {
    margin: theme.spacing(1),
    marginLeft: 'auto',
  }
});

export interface AdminEventInfoProps {
  anchorEl: HTMLElement;
  event: ExtendedCalendarEvent;
  open: boolean;
  onClose: () => void;
}

export interface AdminEventInfoState {
  showDeleteDialog: boolean;
}

type AdminEventInfoProps_ = AdminEventInfoProps & WithStyles<typeof styles> & WithSnackbarProps;

class AdminEventInfo extends React.Component<AdminEventInfoProps_, AdminEventInfoState> {

  constructor(props: AdminEventInfoProps_) {
    super(props);
    this.state = {
      showDeleteDialog: false,
    };
  }

  render() {
    const { open, onClose, anchorEl } = this.props;
    return (
      <>
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
        {this.renderDeleteDialog()}
      </>
    )
  }

  private renderEvent() {
    const { event } = this.props;
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
    if (!event.rentable) {
      return null;
    }
    return (
      <Grid container>
        <Grid item>
          <LocationOnIcon fontSize="small" />
        </Grid>
        <Grid>
          <Typography variant="caption">
            {event.rentable.name}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  private renderDeleteDialog() {
    const { event } = this.props;
    const { showDeleteDialog } = this.state;
    return (
      <Dialog
        open={showDeleteDialog}
        onClose={this.closeDeleteDialog}
      >
        <DialogTitle>{`Delete ${event.title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the event {event.title}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDeleteDialog} color="primary" autoFocus>
            No
          </Button>
          <Button onClick={this.deleteEvent} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  private openDeleteDialog = () => {
    this.setState({ showDeleteDialog: true });
  }

  private closeDeleteDialog = () => {
    this.setState({ showDeleteDialog: false });
  }

  private deleteEvent = async () => {
    const { event, onClose, enqueueSnackbar } = this.props;
    BSGServices.getInstance().deleteEvent(event.id).then(() => {
      event.baseEvent.remove();
      enqueueSnackbar(`Deleted ${event.title}`, { variant: 'success' });
    }).catch((e) => {
      (console).error(e);
      enqueueSnackbar(`Failed to delete ${event.title}`, { variant: 'error' });
    });
    this.setState({ showDeleteDialog: false });
    onClose();
  }

  private renderActions() {
    return (
      <CardActions disableSpacing>
        {this.renderUrlAction()}
        {this.renderDeleteAction()}
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
        <IconButton className={classes.button} size="small">
          <OpenInBrowserIcon />
        </IconButton>
      </Link>
    );
  }

  private renderDeleteAction() {
    const { classes } = this.props;
    return (
      <IconButton className={classes.adminButton} size="small" onClick={this.openDeleteDialog}>
        <DeleteIcon />
      </IconButton>
    )
  }

  private renderEditAction() {

  }
}

export default withStyles(styles)(withSnackbar(AdminEventInfo));
