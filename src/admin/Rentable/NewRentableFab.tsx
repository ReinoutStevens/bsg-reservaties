import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { WithStyles, withStyles } from '@material-ui/styles';
import { Fab, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import NewRentableDialog from './NewRentableDialog';


const styles = (theme: Theme) => createStyles({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
});


export interface NewRentableFabProps {

}

export interface NewRentableFabState {
  open: boolean;
}

type NewRentableFabProps_ = WithStyles<typeof styles>;

class NewRentableFab extends React.Component<NewRentableFabProps_, NewRentableFabState> {
  constructor(props: NewRentableFabProps_) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    return (
      <>
        {this.renderFab()}
        {this.renderDialog()}
      </>
    );
  }

  private renderFab() {
    const { classes } = this.props;
    return (
      <Tooltip title="Add">
        <Fab aria-label="Add" className={classes.fab} color="primary" onClick={this.openDialog}>
          <AddIcon />
        </Fab>
      </Tooltip>
    );
  }

  private renderDialog() {
    const { open } = this.state;
    return <NewRentableDialog open={open} onClose={this.closeDialog} />;
  }

  private openDialog = () => {
    this.setState({ open: true });
  }

  private closeDialog = () => {
    this.setState({ open: false });
  }
}

export default withStyles(styles)(NewRentableFab);
