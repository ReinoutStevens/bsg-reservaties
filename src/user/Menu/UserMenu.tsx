import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';

import { Link } from 'react-router-dom';
import withFirebase, { WithFirebase } from '../../core/Session/withFirebase';

export interface UserMenuProps {
  onClick: () => void;
}

type UserMenuProps_ = UserMenuProps & WithFirebase;

class UserMenu extends React.Component<UserMenuProps_> {

  render() {
    const { currentUser } = this.props;
    if (!currentUser) {
      return null;
    }
    return (
      <List>
        {this.renderItem('Events', '/user/events', <EventIcon />)}
      </List>
    );
  }

  private renderItem(name: string, to: string, icon: JSX.Element) {
    const { onClick } = this.props;
    return (
      <ListItem button component={Link} to={to} onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    );
  }
}

export default withFirebase(UserMenu);
