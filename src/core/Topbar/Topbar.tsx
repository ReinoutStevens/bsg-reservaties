import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/styles';
import AdminMenu from '../../admin/Menu/AdminMenu';
import { Drawer, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

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
});

export interface TopBarState {
  menuOpen: boolean;
}

type TopBarProps_ = WithStyles<typeof styles>;

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
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={this.toggleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Link
              component={RouterLink}
              to="/"
              variant="h6"
              className={classes.title}
              underline={'none'}
            >
              BSG Reservaties
            </Link>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
        {this.renderDrawer()}
      </div>
    );
  }

  private renderDrawer() {
    const { menuOpen } = this.state;
    return (
      <Drawer open={menuOpen} onClose={this.toggleMenu}>
        <AdminMenu onClick={this.toggleMenu} />
      </Drawer>
    );
  }

  private toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  }
}

export default withStyles(styles)(TopBar);