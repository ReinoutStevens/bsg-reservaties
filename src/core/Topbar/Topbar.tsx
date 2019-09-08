import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/styles';
import AdminMenu from '../../admin/Menu/AdminMenu';
import { Drawer, Link, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import withFirebase, { WithFirebase } from '../Session/withFirebase';
import UserMenu from '../../user/Menu/UserMenu';

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: theme.palette.primary.contrastText,
  },
  signIn: {
    color: theme.palette.primary.contrastText,
  },
  signOut: {
    color: theme.palette.primary.contrastText,
  }
});

export interface TopBarState {
  menuOpen: boolean;
}

type TopBarProps_ = WithStyles<typeof styles> & WithFirebase;

class TopBar extends React.Component<TopBarProps_, TopBarState> {
  constructor(props: TopBarProps_) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {this.renderHamburger()}
            <Link
              component={RouterLink}
              to="/"
              variant="h6"
              className={classes.title}
              underline={'none'}
            >
              <Typography variant="h6">BSG Calendar</Typography>
              <Typography variant="subtitle2">In Tomat zijn jaar was alles beter</Typography>
            </Link>
            {this.renderSignInOut()}
          </Toolbar>
        </AppBar>
        {this.renderDrawer()}
      </div>
    );
  }

  private renderHamburger() {
    const { currentUser, classes } = this.props;
    if (!currentUser) {
      return null;
    }
    return (
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={this.toggleMenu}
      >
        <MenuIcon />
      </IconButton>
    );
  }

  private renderSignInOut() {
    const { currentUser } = this.props;
    if (currentUser) {
      return this.renderSignOut();
    } else {
      return this.renderSignIn();
    }
  }

  private renderSignIn() {
    const { classes } = this.props;
    return (
      <Link
        component={RouterLink}
        className={classes.signIn}
        underline={'none'}
        to="/signin"
      >
        <Button color="inherit">Login</Button>
      </Link>
    );
  }

  private renderSignOut() {
    const { classes, firebase } = this.props;
    return (
      <Button color="inherit" className={classes.signIn} onClick={() => firebase.signOut()}>
        Sign Out
      </Button>
    );
  }

  private renderDrawer() {
    const { menuOpen } = this.state;
    return (
      <Drawer open={menuOpen} onClose={this.toggleMenu}>
        <UserMenu onClick={this.toggleMenu} />
        <AdminMenu onClick={this.toggleMenu} />
      </Drawer>
    );
  }

  private toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  }
}

export default withStyles(styles)(withFirebase(TopBar));
