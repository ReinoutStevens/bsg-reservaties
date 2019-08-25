import React from 'react';
import {
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
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
import { ExtendedCalendarEvent } from '../../core/EventsCalendar/EventsCalendar';
import withCalendar, { WithCalendar } from '../../core/EventsCalendar/withCalendar';

export interface UpdateEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: ExtendedCalendarEvent;
}

export interface UpdateEventDialogState {
  title: string;
  description: string;
  start: DateTime | null;
  end: DateTime | null;
  url: string | null;
  rentableId: string | null;
  allDay: boolean;
}

type UpdateEventDialogProps_ = UpdateEventDialogProps & WithSnackbarProps & WithCalendar;

class UpdateEventDialog extends React.Component<UpdateEventDialogProps_, UpdateEventDialogState> {
  constructor(props: UpdateEventDialogProps_) {
    super(props);
    const { event } = props;
    this.state = {
      title: event.title,
      description: event.description || '',
      url: event.url || null,
      rentableId: event.rentable ? event.rentable.id : null,
      start: event.start,
      end: event.end,
      allDay: false,
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
        start: event.start,
        end: event.end,
        allDay: false,
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
          {this.renderAllDay()}
          {this.renderStartPicker()}
          {this.renderEndPicker()}
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
    const { title, start, end } = this.state;
    return !!(title && title.trim().length > 0 && start && end && end > start);
  }

  private update = () => {
    const { onClose, enqueueSnackbar, event } = this.props;
    const { title, start, end, description, allDay } = this.state;
    const evInput = {
      id: event.id,
      title: title!.trim(),
      start: allDay ? start!.startOf('day') : start!,
      end: allDay ? start!.endOf('day') : end!,
      description: description.length > 0 ? description : null,
      approved: event.approved,
    }
    BSGServices.getInstance().updateEvent(evInput).then((res) => {
      enqueueSnackbar(`Updated ${title}`, { variant: 'success' });
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

export default withSnackbar(withCalendar(UpdateEventDialog));
