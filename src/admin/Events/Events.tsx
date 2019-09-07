import React from 'react';
import AdminCalendar from './AdminCalendar';
import { Divider } from '@material-ui/core';
import UnapprovedEvents from './UnapprovedEvents';


class Events extends React.Component {

  render() {
    return (<>
      <AdminCalendar />
      <Divider />
      <UnapprovedEvents />
    </>
    );
  }
}

export default Events;
