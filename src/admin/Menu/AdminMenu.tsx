import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import MeetinRoomIcon from '@material-ui/icons/MeetingRoom';
import EventIcon from '@material-ui/icons/Event';

import { Link } from 'react-router-dom';

export interface AdminMenuProps {
  onClick: () => void;
}

class AdminMenu extends React.Component<AdminMenuProps> {

  render() {
    return (
      <List>
        {this.renderItem('Events', '/events', <EventIcon />)}
        {this.renderItem('Rentables', '/rentables', <MeetinRoomIcon />)}

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

export default AdminMenu;
