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
import FirebaseContext from './Session/FirebaseContext';
import Firebase from './Session/Firebase';

const theme = createMuiTheme();


const App: React.FC = () => {
  return (
    <FirebaseContext.Provider value={{ firebase: new Firebase() }}>
      <Router>
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={LuxonUtils}>
            <SnackbarProvider>
              <Helmet>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
              </Helmet>
              <CssBaseline />
              <TopBar />
              <Container component="main">
                <AppRoutes />
              </Container>
            </SnackbarProvider>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </Router>
    </FirebaseContext.Provider>
  );
}

export default App;
