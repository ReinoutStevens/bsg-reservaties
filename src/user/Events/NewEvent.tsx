import React from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  NativeSelect,
  Input,
  FormControl,
  InputLabel,
  Grid,
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { DateTime } from 'luxon';
import {
  DateTimePicker, MaterialUiPickersDate, DatePicker,
} from "@material-ui/pickers";
import Form from '../../core/Form/Form';
import FormField from '../../core/Form/FormField';
import withServices, { WithServices } from '../../services/withServices';
import withFirebase, { WithFirebase } from '../../core/Session/withFirebase';
import { withRouter, RouteComponentProps } from 'react-router';
import { Rentable } from '../../services/Rentable';
import FormButton from '../../core/Form/FormButton';

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
  loading: boolean;
  rentables: Rentable[];
}

type NewEventProps_ = NewEventProps & WithSnackbarProps & WithServices & WithFirebase & RouteComponentProps;

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
      loading: true,
      rentables: [],
    }
  }

  async componentDidMount() {
    const { services } = this.props;
    const rentables = await services.events.getRentables();
    const rentableId = rentables.length > 0 ? rentables[0].id : null;
    this.setState({ loading: false, rentables: rentables, rentableId: rentableId });
  }

  render() {
    return (
      <Form title="Create Event">
        {this.renderTitleField()}
        {this.renderDescriptionField()}
        {this.renderLocationField()}
        {this.renderAllDay()}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {this.renderStartPicker()}
          </Grid>
          <Grid item xs={12} sm={6}>
            {this.renderEndPicker()}
          </Grid>
        </Grid>
        <FormButton onClick={this.save} color="primary" disabled={!this.canSave()}>
          Create
        </FormButton>
      </Form>
    );
  }

  private canSave(): boolean {
    const { title, start, end } = this.state;
    return !!(title && title.trim().length > 0 && start && end && end > start);
  }

  private save = () => {
    const { enqueueSnackbar, services, currentUser, history } = this.props;
    const { title, start, end, description, allDay, rentableId } = this.state;
    const evInput = {
      title: title!.trim(),
      start: allDay ? start!.startOf('day') : start!,
      end: allDay ? start!.endOf('day') : end!,
      description: description.length > 0 ? description : null,
      approved: false,
      userId: currentUser!.uid,
      rentableId: rentableId || undefined,
    }
    services.events.createEvent(evInput).then((ev) => {
      enqueueSnackbar(`Requested ${ev.title}`);
    }).catch((e) => {
      (console).error(e);
      enqueueSnackbar(`Failed requesting ${title}`, { variant: 'error' });
    });
    history.push('/user/events');
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
        fullWidth
        label="Description"
      />
    );
  }

  private renderLocationField() {
    const { rentables, rentableId } = this.state;
    return (
      <FormControl fullWidth>
        <InputLabel htmlFor="location-select">Location</InputLabel>
        <NativeSelect
          value={rentableId || ''}
          onChange={this.selectRentable}
          inputProps={{
            name: 'Location',
            id: 'location-select',
          }}
          fullWidth
          variant="outlined"
          input={<Input name="Location" id="age-native-helper" />}
        >
          {rentables.map((rentable) => {
            return (
              <option key={rentable.id} value={rentable.id}>{rentable.name}</option>
            );
          })}
        </NativeSelect>
      </FormControl>

    );
  }

  private selectRentable = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ rentableId: ev.currentTarget.value });
  }

  private renderAllDay() {
    const { allDay } = this.state;
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox checked={allDay} onChange={this.changeAllDay} value="checkedA" />
          }
          label="All day"
        />

      </FormGroup>
    );
  }

  private renderStartPicker() {
    const { start, allDay } = this.state;
    if (allDay) {
      return (
        <DatePicker
          value={start}
          onChange={this.changeStartDate}
          label="Start of Event"
          margin="normal"
          fullWidth
        />
      );
    } else {
      return (
        <DateTimePicker
          value={start}
          onChange={this.changeStartDate}
          label="Start of Event"
          ampm={false}
          margin="normal"
          fullWidth
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
        label="End of event"
        ampm={false}
        margin="normal"
        fullWidth
      />
    );
  }

  private changeAllDay = (ev: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ allDay: checked })
  }

  private changeStartDate = (date: MaterialUiPickersDate) => {
    const { end, allDay } = this.state;
    if (!end && !allDay && date) {
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

export default withSnackbar(withFirebase(withRouter(withServices(NewEvent))));
