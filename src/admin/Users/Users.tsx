import React from 'react';
import withServices, { WithServices } from '../../services/withServices';
import { User } from '../../services/UserServices';
import { createStyles, Theme, TableCell, TableHead, Table, Paper, TableBody, TableRow } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/styles';
import NewUserFab from './NewUserFab';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
});


export interface UsersState {
  loading: boolean;
  users: User[];
}

type UsersProps_ = WithServices & WithStyles<typeof styles>;
class Users extends React.Component<UsersProps_, UsersState> {
  constructor(props: UsersProps_) {
    super(props);
    this.state = {
      loading: true,
      users: [],
    };
  }

  async componentDidMount() {
    const { services } = this.props;
    this.setState({ loading: true });
    const users = await services.users.getAllUsers();
    this.setState({ loading: false, users: users });
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <Paper className={classes.root}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.renderContent()}
            </TableBody>
          </Table>
        </Paper>
        <NewUserFab />
      </>
    );
  }

  private renderContent() {
    const { users, loading } = this.state;
    if (loading) {
      return null;
    }
    return users.map((user) => {
      return (
        <TableRow key={user.uid}>
          <TableCell>{user.displayName}</TableCell>
          <TableCell>{user.email}</TableCell>
        </TableRow>
      );
    });
  }

}

export default withStyles(styles)(withServices(Users));
