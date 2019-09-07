import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Fab, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withRouter, RouteComponentProps } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
);


const NewRentableFab: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();
  const onPush = () => {
    history.push('/admin/rentables/new');
  }
  return (
    <Tooltip title="Add">
      <Fab aria-label="Add" className={classes.fab} color="primary" onClick={onPush}>
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};

export default withRouter(NewRentableFab);
