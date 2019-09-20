import React from 'react';
import { Theme, createStyles } from '@material-ui/core/styles';
import { WithStyles, withStyles } from '@material-ui/styles';
import PartyModeIcon from '@material-ui/icons/PartyMode';
import { Tooltip, Fab } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  party: {
    cursor: `url("/mouse.png"), auto`,
  }
});

export interface PartyFabState {
  partyActivated: boolean;
}

type PartyFabProps_ = WithStyles<typeof styles>;

class PartyFab extends React.Component<PartyFabProps_, PartyFabState> {

  constructor(props: PartyFabProps_) {
    super(props);
    this.state = {
      partyActivated: false,
    };
  }

  componentWillUnmount() {
    const { partyActivated } = this.state;
    if (partyActivated) {
      this.removeMouseClass();
    }
  }

  render() {
    const { classes } = this.props;
    const { partyActivated } = this.state;

    return (
      <Tooltip title="All hail the zaalbeheerder">
        <Fab aria-label="Add" className={classes.fab} color="primary" onClick={this.party} disabled={partyActivated}>
          <PartyModeIcon />
        </Fab>
      </Tooltip>
    );
  }

  private party = () => {
    this.addMouseClass();
    this.setState({ partyActivated: true });
  }

  addMouseClass() {
    const { classes } = this.props;
    document.body.classList.add(classes.party);
  }

  removeMouseClass() {
    const { classes } = this.props;
    document.body.classList.remove(classes.party);
  }
}

export default withStyles(styles)(PartyFab);
