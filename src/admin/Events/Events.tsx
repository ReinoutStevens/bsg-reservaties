import React from 'react';
import AdminCalendar from './AdminCalendar';
import { Divider, Container } from '@material-ui/core';
import UnapprovedEvents from './UnapprovedEvents';


class Events extends React.Component {

  render() {
    return (
      <Container>
        <AdminCalendar />
        <Divider />
        <UnapprovedEvents />
      </Container>
    );
  }
}

export default Events;
