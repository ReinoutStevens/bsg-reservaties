import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import MeetinRoomIcon from '@material-ui/icons/MeetingRoom';
import { Link } from 'react-router-dom';

export interface AdminMenuProps {
  onClick: () => void;
}

class AdminMenu extends React.Component<AdminMenuProps> {

  render() {
    return (
      <List>
        {this.renderItem('Rentables', '/rentables', <MeetinRoomIcon />)}
      </List>
    );
  }

  private renderItem(name: string, to: string, icon: JSX.Element) {
    const { onClick } = this.props;
    return (
      <ListItem button component={Link} to={to} onClick={onClick}>
        <ListItemIcon><MeetinRoomIcon /></ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    );
  }
}

export default AdminMenu;
