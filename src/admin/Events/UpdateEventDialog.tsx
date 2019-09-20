import React from 'react';
import {
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { DateTime } from 'luxon';
import {
  MaterialUiPickersDate, DatePicker,
} from "@material-ui/pickers";
import { ExtendedCalendarEvent } from '../../core/EventsCalendar/EventsCalendar';
import withCalendar, { WithCalendar } from '../../core/EventsCalendar/withCalendar';
import withServices, { WithServices } from '../../services/withServices';
import LocationField from '../../core/Form/LocationField';

export interface UpdateEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: ExtendedCalendarEvent;
}

export interface UpdateEventDialogState {
  title: string;
  description: string;
  day: DateTime | null;
  url: string | null;
  rentableId: string | null;
}

type UpdateEventDialogProps_ = UpdateEventDialogProps & WithSnackbarProps & WithCalendar & WithServices;

class UpdateEventDialog extends React.Component<UpdateEventDialogProps_, UpdateEventDialogState> {
  constructor(props: UpdateEventDialogProps_) {
    super(props);
    const { event } = props;
    this.state = {
      title: event.title,
      description: event.description || '',
      url: event.url || null,
      rentableId: event.rentable ? event.rentable.id : null,
      day: event.start,
    }
  }

  componentDidUpdate(prevProps: UpdateEventDialogProps) {
    const { event } = this.props;
    if (event.id !== prevProps.event.id) {
      this.setState({
        title: event.title,
        description: event.description || '',
        url: event.url || null,
        rentableId: event.rentable ? event.rentable.id : null,
        day: event.start,
      })
    }
  }

  render() {
    const { open, onClose, event } = this.props;
    return (
      <Dialog open={open}>
        <DialogTitle>Edit {event.title}</DialogTitle>
        <DialogContent>
          {this.renderTitleField()}
          {this.renderDescriptionField()}
          {this.renderLocationField()}
          {this.renderDayPicker()}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.update} color="primary" disabled={!this.canUpdate()}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private canUpdate(): boolean {
    const { title, day } = this.state;
    return !!(title && title.trim().length > 0 && day);
  }

  private update = () => {
    const { onClose, enqueueSnackbar, event, services } = this.props;
    const { title, day, description, rentableId } = this.state;
    const evInput = {
      id: event.id,
      title: title!.trim(),
      day: day!.startOf('day'),
      description: description.length > 0 ? description : null,
      approved: event.approved,
      userId: event.userId,
      rentableId: rentableId ? rentableId : undefined,
    }
    services.events.updateEvent(evInput).then((res) => {
      enqueueSnackbar(`Updated ${title}`);
      this.props.onUpdateEvent(event, res);
    }).catch((e) => {
      (console).error(e);
      enqueueSnackbar(`Failed updating ${title}`, { variant: 'error' });
    })
    onClose();
  }

  private renderTitleField() {
    const { title } = this.state;
    return (
      <TextField
        onChange={this.changeTitle}
        value={title}
        fullWidth
        margin="dense"
        label="Title"
      />
    );
  }

  private renderDescriptionField() {
    const { description } = this.state;
    return (
      <TextField
        onChange={this.changeDescription}
        fullWidth
        multiline
        margin="dense"
        label="Description"
        value={description}
      />
    );
  }

  private renderDayPicker() {
    const { day } = this.state;
    return (
      <DatePicker
        value={day}
        onChange={this.changeDay}
        fullWidth
        label="Day"
      />
    );
  }

  private renderLocationField() {
    const { rentableId } = this.state;
    return (
      <LocationField
        rentableId={rentableId}
        onChange={this.selectRentable}
      />
    );
  }

  private selectRentable = (id: string | null) => {
    this.setState({ rentableId: id });
  }

  private changeDay = (date: MaterialUiPickersDate) => {
    this.setState({ day: date });
  }

  private changeTitle = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: ev.target.value });
  }

  private changeDescription = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: ev.target.value });
  }
}

export default withSnackbar(withCalendar(withServices(UpdateEventDialog)));
