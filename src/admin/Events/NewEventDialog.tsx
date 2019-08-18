import React from 'react';
import { 
  Dialog, 
  TextField, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  Checkbox, 
  FormControlLabel 
} from '@material-ui/core';
import BSGServices from '../../services/BSGServices';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { DateTime } from 'luxon';
import {
  DateTimePicker, MaterialUiPickersDate, DatePicker,
} from "@material-ui/pickers";

export interface NewEventDialogProps {
  open: boolean;
  onClose: () => void;
  start?: DateTime | null;
  end?: DateTime | null;
  allDay: boolean;
}

export interface NewEventDialogState {
  title: string;
  description: string;
  start: DateTime | null;
  end: DateTime | null;
  url: string | null;
  rentableId: string | null;
  allDay: boolean;
}

type NewEventDialogProps_ = NewEventDialogProps & WithSnackbarProps;

class NewEventDialog extends React.Component<NewEventDialogProps_, NewEventDialogState> {
  constructor(props: NewEventDialogProps_) {
    super(props);
    this.state = {
      title: '',
      description: '',
      url: null,
      rentableId: null,
      start: props.start || null,
      end: props.end || null,
      allDay: props.allDay,
    }
  }

  componentDidUpdate(prevProps: NewEventDialogProps) {
    if (this.props.start !== prevProps.start || this.props.end !== prevProps.end) {
      this.setState({
        start: this.props.start || null,
        end: this.props.end || null,
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
          {this.renderAllDay()}
          {this.renderStartPicker()}
          {this.renderEndPicker()}
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
    const { title, start, end } = this.state;
    return !!(title && title.length > 0 && start && end);
  }

  private save = () => {
    const { onClose, enqueueSnackbar } = this.props;
    const { title, start, end, description, allDay } = this.state;
    const evInput = {
      title: title!,
      start: allDay ? start!.startOf('day') : start!,
      end: allDay ? start!.endOf('day') : end!,
      description: description.length > 0 ? description : null,
    }
    BSGServices.getInstance().createEvent(evInput).then((ev) => {
      enqueueSnackbar(`Created ${ev.title}`);
    }).catch((e) => {
      (console).error(e);
      enqueueSnackbar(`Failed saving ${title}`);
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

  private renderAllDay() {
    const { allDay } = this.state;
    return (
      <FormControlLabel
        control={
          <Checkbox checked={allDay} onChange={this.changeAllDay} value="checkedA" />
        }
        label="All day"
      />
    );
  }

  private renderStartPicker() {
    const { start, allDay } = this.state;
    if (allDay) {
      return (
        <DatePicker
          value={start}
          onChange={this.changeStartDate}
          fullWidth
          label="start"
        />
      );
    } else {
      return (
        <DateTimePicker
          value={start}
          onChange={this.changeStartDate}
          fullWidth
          label="Start of event"
          ampm={false}
        />
      );
    }
  }

  private renderEndPicker() {
    const { end, start, allDay } = this.state;
    if (allDay) {
      return null;
    }
    const minDate = start;
    return (
      <DateTimePicker
        value={end}
        onChange={this.changeEndDate}
        minDate={minDate}
        fullWidth
        label="End of event"
        ampm={false}
      />
    );
  }

  private changeAllDay = (ev: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ allDay: checked })
  }

  private changeStartDate = (date: MaterialUiPickersDate) => {
    const { end, allDay } = this.state;
    if (!end && !allDay) {
      this.setState({
        start: date,
        end: (date as DateTime).endOf('day'),
      });
    } else {
      this.setState({ start: date });
    }
  }

  private changeEndDate = (date: MaterialUiPickersDate) => {
    this.setState({ end: date });
  }

  private changeTitle = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: ev.target.value });
  }

  private changeDescription = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: ev.target.value });
  }
}

export default withSnackbar(NewEventDialog);
