import React from 'react';
import {
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { DateTime } from 'luxon';
import {
  MaterialUiPickersDate, DatePicker,
} from "@material-ui/pickers";
import withCalendar, { WithCalendar } from '../../core/EventsCalendar/withCalendar';
import withServices, { WithServices } from '../../services/withServices';
import withFirebase, { WithFirebase } from '../../core/Session/withFirebase';
import LocationField from '../../core/Form/LocationField';

export interface NewEventDialogProps {
  open: boolean;
  onClose: () => void;
  day?: DateTime | null;
}

export interface NewEventDialogState {
  title: string;
  description: string;
  day: DateTime | null;
  url: string | null;
  rentableId: string | null;
}

type NewEventDialogProps_ = NewEventDialogProps & WithSnackbarProps & WithCalendar & WithServices & WithFirebase;

class NewEventDialog extends React.Component<NewEventDialogProps_, NewEventDialogState> {
  constructor(props: NewEventDialogProps_) {
    super(props);
    this.state = {
      title: '',
      description: '',
      url: null,
      rentableId: null,
      day: props.day || null,
    }
  }

  componentDidUpdate(prevProps: NewEventDialogProps) {
    if (this.props.day !== prevProps.day) {
      this.setState({
        day: this.props.day || null,
      });
    }
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open}>
        <DialogTitle>Create Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a new event
          </DialogContentText>
          {this.renderTitleField()}
          {this.renderDescriptionField()}
          {this.renderLocationField()}
          {this.renderDayPicker()}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.save} color="primary" disabled={!this.canSave()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private canSave(): boolean {
    const { title, day } = this.state;
    return !!(title && title.trim().length > 0 && day);
  }

  private save = () => {
    const { onClose, enqueueSnackbar, services, currentUser } = this.props;
    const { title, day, description, rentableId } = this.state;
    const evInput = {
      title: title!.trim(),
      day: day!.startOf('day'),
      description: description.length > 0 ? description : null,
      approved: true,
      userId: currentUser!.uid,
      rentableId: rentableId ? rentableId : undefined,
    };
    services.events.createApprovedEvent(evInput).then((ev) => {
      enqueueSnackbar(`Created ${ev.title}`);
      this.props.onNewEvent(ev);
    }).catch((e) => {
      (console).error(e);
      enqueueSnackbar(`Failed saving ${title}`, { variant: 'error' });
    })
    onClose();
  }

  private renderTitleField() {
    return (
      <TextField
        onChange={this.changeTitle}
        fullWidth
        margin="dense"
        label="Title"
      />
    );
  }

  private renderDescriptionField() {
    return (
      <TextField
        onChange={this.changeDescription}
        fullWidth
        multiline
        margin="dense"
        label="Description"
      />
    );
  }

  private renderLocationField() {
    const { rentableId } = this.state;
    return (
      <LocationField
        rentableId={rentableId}
        onChange={this.selectRentable} />
    );
  }

  private selectRentable = (id: string | null) => {
    this.setState({ rentableId: id });
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

export default withSnackbar(withCalendar(withFirebase(withServices(NewEventDialog))));
