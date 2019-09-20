import React from 'react';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { DateTime } from 'luxon';
import {
  MaterialUiPickersDate, DatePicker,
} from "@material-ui/pickers";
import Form from '../../core/Form/Form';
import FormField from '../../core/Form/FormField';
import withServices, { WithServices } from '../../services/withServices';
import FormButton from '../../core/Form/FormButton';
import LocationField from '../../core/Form/LocationField';
import { CalendarEvent } from '../../services/Events';
import { withRouter, RouteComponentProps } from 'react-router';

export interface UpdateEventProps {
  event: CalendarEvent;
}

export interface UpdateEventState {
  title: string;
  description: string;
  day: DateTime | null;
  url: string | null;
  rentableId: string | null;
  approved: boolean;
}

type UpdateEventProps_ = UpdateEventProps & WithSnackbarProps & WithServices & RouteComponentProps;

class UpdateEvent extends React.Component<UpdateEventProps_, UpdateEventState> {
  constructor(props: UpdateEventProps_) {
    super(props);
    const { event } = props;
    this.state = {
      title: event.title,
      description: event.description || '',
      url: event.url || null,
      rentableId: event.rentable ? event.rentable.id : null,
      day: event.start,
      approved: event.approved,
    }
  }

  render() {
    return (
      <Form title="Update Event">
        {this.renderTitleField()}
        {this.renderDescriptionField()}
        {this.renderLocationField()}
        {this.renderDayPicker()}
        <FormButton onClick={this.update} color="primary" disabled={!this.canSave()}>
          Update
        </FormButton>
      </Form>
    );
  }

  private canSave(): boolean {
    const { title, day } = this.state;
    return !!(title && title.trim().length > 0 && day);
  }

  private update = () => {
    const { enqueueSnackbar, services, history } = this.props;
    const { title, day, description, rentableId, approved } = this.state;
    const evInput = {
      title: title!.trim(),
      day: day!,
      description: description.length > 0 ? description : null,
      userId: this.props.event.userId,
      rentableId: rentableId || undefined,
      approved: approved,
      id: this.props.event.id,
    }
    services.events.updateEvent(evInput).then((ev) => {
      enqueueSnackbar(`Updated ${ev.title}`);
    }).catch((e) => {
      (console).error(e);
      enqueueSnackbar(`Failed updating ${title}`, { variant: 'error' });
    });
    history.push('/admin/events');
  }

  private renderTitleField() {
    return (
      <FormField
        onChange={this.changeTitle}
        fullWidth
        label="Title"
        value={this.state.title}
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
        value={this.state.description}
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

export default withSnackbar(withRouter(withServices(UpdateEvent)));
