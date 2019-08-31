import React from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { DateTime } from 'luxon';
import {
  DateTimePicker, MaterialUiPickersDate, DatePicker,
} from "@material-ui/pickers";
import Form from '../../core/Form/Form';
import FormField from '../../core/Form/FormField';
import withServices, { WithServices } from '../../services/withServices';

export interface NewEventProps {
}

export interface NewEventState {
  title: string;
  description: string;
  start: DateTime | null;
  end: DateTime | null;
  url: string | null;
  rentableId: string | null;
  allDay: boolean;
}

type NewEventProps_ = NewEventProps & WithSnackbarProps & WithServices;

class NewEvent extends React.Component<NewEventProps_, NewEventState> {
  constructor(props: NewEventProps_) {
    super(props);
    this.state = {
      title: '',
      description: '',
      url: null,
      rentableId: null,
      start: null,
      end: null,
      allDay: false,
    }
  }

  render() {
    return (
      <Form title="Create Event">
        {this.renderTitleField()}
        {this.renderDescriptionField()}
        {this.renderAllDay()}
        {this.renderStartPicker()}
        {this.renderEndPicker()}
        <Button onClick={this.save} color="primary" disabled={!this.canSave()}>
          Create
        </Button>
      </Form>
    );
  }

  private canSave(): boolean {
    const { title, start, end } = this.state;
    return !!(title && title.trim().length > 0 && start && end && end > start);
  }

  private save = () => {
    const { enqueueSnackbar, services } = this.props;
    const { title, start, end, description, allDay } = this.state;
    const evInput = {
      title: title!.trim(),
      start: allDay ? start!.startOf('day') : start!,
      end: allDay ? start!.endOf('day') : end!,
      description: description.length > 0 ? description : null,
      approved: false,
    }
    services.events.createEvent(evInput).then((ev) => {
      enqueueSnackbar(`Requested ${ev.title}`, { variant: 'success' });
    }).catch((e) => {
      (console).error(e);
      enqueueSnackbar(`Failed requesting ${title}`, { variant: 'error' });
    })
  }

  private renderTitleField() {
    return (
      <FormField
        onChange={this.changeTitle}
        fullWidth
        label="Title"
      />
    );
  }

  private renderDescriptionField() {
    return (
      <FormField
        onChange={this.changeDescription}
        multiline
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
          margin="normal"
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
          margin="normal"
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
        margin="normal"
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

export default withSnackbar(withServices(NewEvent));
