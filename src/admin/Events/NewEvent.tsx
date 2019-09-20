import React from 'react';

import { withSnackbar, WithSnackbarProps } from 'notistack';
import { DateTime } from 'luxon';
import {
  MaterialUiPickersDate, DatePicker,
} from "@material-ui/pickers";
import Form from '../../core/Form/Form';
import FormField from '../../core/Form/FormField';
import withServices, { WithServices } from '../../services/withServices';
import withFirebase, { WithFirebase } from '../../core/Session/withFirebase';
import { withRouter, RouteComponentProps } from 'react-router';
import FormButton from '../../core/Form/FormButton';
import LocationField from '../../core/Form/LocationField';

export interface NewEventProps {
}

export interface NewEventState {
  title: string;
  description: string;
  day: DateTime | null;
  url: string | null;
  rentableId: string | null;
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
      day: null,
    }
  }

  render() {
    return (
      <Form title="Create Event">
        {this.renderTitleField()}
        {this.renderDescriptionField()}
        {this.renderLocationField()}
        {this.renderDayPicker()}
        <FormButton onClick={this.save} color="primary" disabled={!this.canSave()}>
          Create
        </FormButton>
      </Form>
    );
  }

  private canSave(): boolean {
    const { title, day } = this.state;
    return !!(title && title.trim().length > 0 && day);
  }

  private save = () => {
    const { enqueueSnackbar, services, currentUser, history } = this.props;
    const { title, day, description, rentableId } = this.state;
    const evInput = {
      title: title!.trim(),
      day: day!,
      description: description.length > 0 ? description : null,
      approved: true,
      userId: currentUser!.uid,
      rentableId: rentableId || undefined,
    }
    services.events.createApprovedEvent(evInput).then((ev) => {
      enqueueSnackbar(`Requested ${ev.title}`);
    }).catch((e) => {
      (console).error(e);
      enqueueSnackbar(`Failed requesting ${title}`, { variant: 'error' });
    });
    history.push('/admin/events');
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

  private renderDayPicker() {
    const { day } = this.state;
    return (
      <DatePicker
        value={day}
        onChange={this.changeDay}
        label="Day"
        margin="normal"
        fullWidth
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

export default withSnackbar(withFirebase(withRouter(withServices(NewEvent))));
