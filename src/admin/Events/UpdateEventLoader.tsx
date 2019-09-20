import React from 'react';
import { CalendarEvent } from '../../services/Events';
import withServices, { WithServices } from '../../services/withServices';
import Skeleton from '@material-ui/lab/Skeleton';
import { Container } from '@material-ui/core';
import UpdateEvent from './UpdateEvent';

export interface UpdateEventLoaderProps {
  id: string;
}

export interface UpdateEventState {
  isLoading: boolean;
  event: CalendarEvent | null;
}

type UpdateEventLoaderProps_ = UpdateEventLoaderProps & WithServices;
class UpdateEventLoader extends React.Component<UpdateEventLoaderProps_, UpdateEventState> {
  constructor(props: UpdateEventLoaderProps_) {
    super(props);
    this.state = {
      isLoading: true,
      event: null,
    }
  }

  async componentDidMount() {
    const { services, id } = this.props;
    const event = await services.events.getEvent(id);
    this.setState({ event: event, isLoading: false });
  }

  render() {
    const { isLoading, event } = this.state;

    if (isLoading) {
      return (
        <Container maxWidth="md">
          <Skeleton variant="rect" width="100%" height="100%" />
        </Container>
      );
    } else {
      return <UpdateEvent event={event!} />
    }
  }
}

export default withServices(UpdateEventLoader);
