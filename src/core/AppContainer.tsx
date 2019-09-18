import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(2),
      alignItems: 'center',
    },
  })
);

const AppContainer: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Container component="main" className={classes.paper}>
      {children}
    </Container>
  );
}

export default AppContainer;
