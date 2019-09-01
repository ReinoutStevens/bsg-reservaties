import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import MeetinRoomIcon from '@material-ui/icons/MeetingRoom';
import EventIcon from '@material-ui/icons/Event';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import { Link } from 'react-router-dom';
import withFirebase, { WithFirebase } from '../../core/Session/withFirebase';

export interface AdminMenuProps {
  onClick: () => void;
}

type AdminMenuProps_ = AdminMenuProps & WithFirebase;

class AdminMenu extends React.Component<AdminMenuProps_> {

  render() {
    const { currentUser, firebase } = this.props;
    if (!currentUser) {
      return null;
    }
    if (!firebase.isAdmin) {
      return null;
    }
    return (
      <List>
        <ListSubheader inset>Admin</ListSubheader>
        {this.renderItem('Events', '/admin/events', <EventIcon />)}
        {this.renderItem('Rentables', '/admin/rentables', <MeetinRoomIcon />)}
        {this.renderItem('Users', '/admin/users', <PersonAddIcon />)}

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

export default withFirebase(AdminMenu);
