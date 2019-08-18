import React from 'react';
import { Helmet } from 'react-helmet';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TopBar from './Topbar/Topbar';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from './Routes/AppRoutes';
import { SnackbarProvider } from 'notistack';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';


import './App.scss';

const theme = createMuiTheme();


const App: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <SnackbarProvider>
            <Helmet>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            </Helmet>
            <CssBaseline />
            <Router>
              <TopBar />
              <Container>
                <AppRoutes />
              </Container>
            </Router>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
