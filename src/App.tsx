import React from 'react';
import { Helmet } from 'react-helmet';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TopBar from './Topbar/Topbar';
import EventsCalendar from './EventsCalendar/EventsCalendar';

const App: React.FC = () => {
  return (
    <>
      <Helmet>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Helmet>
      <CssBaseline />
      <TopBar />
      <Container>
        <EventsCalendar />
      </Container>
    </>
  );
}

export default App;
