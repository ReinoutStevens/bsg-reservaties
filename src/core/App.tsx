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
import FirebaseContextProvider from './Session/FirebaseContextProvider';
import ServicesContextProvider from '../services/ServicesContextProvider';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Footer from './Footer/Footer';

library.add(faGithub);


const theme = createMuiTheme();


const App: React.FC = () => {
  return (
    <FirebaseContextProvider>
      <ServicesContextProvider>
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
                <Footer />
              </SnackbarProvider>
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </Router>
      </ServicesContextProvider>
    </FirebaseContextProvider>
  );
}

export default App;
