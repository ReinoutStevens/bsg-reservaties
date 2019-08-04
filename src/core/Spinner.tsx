import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      margin: theme.spacing(2),
    },
  }),
);

const Spinner: React.FC = () => {
  const classes = useStyles();
  return (
    <CircularProgress className={classes.progress} />
  );
}

export default Spinner;
