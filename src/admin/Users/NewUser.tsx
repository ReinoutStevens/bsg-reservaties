import React from 'react';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { Paper, TextField, Button, CircularProgress, createStyles, Typography, Theme } from '@material-ui/core';
import BSGServices from '../../services/BSGServices';
import { WithStyles, withStyles } from '@material-ui/styles';

interface NewUserProps {
}

interface NewUserState {
  saving: boolean;
  email: string;

}

const styles = (theme: Theme) => createStyles({
  button: {
    margin: theme.spacing(),
  }
});

type NewUserProps_ = NewUserProps & WithSnackbarProps & WithStyles<typeof styles>;

class NewUser extends React.Component<NewUserProps_, NewUserState> {
  constructor(props: NewUserProps_) {
    super(props);
    this.state = {
      saving: false,
      email: '',
    }
  }

  render() {
    const { email } = this.state;
    return (
      <>
        <Typography variant="h5">Create User</Typography>
        <Paper>
          <TextField
            value={email}
            onChange={this.onEmailChange}
            type="email"
            autoComplete="email"
            fullWidth
            label="Email"
          />
          {this.renderButton()}
        </Paper>
      </>
    );
  }

  private renderButton() {
    const { classes } = this.props;
    const { saving } = this.state;
    if (saving) {
      return <CircularProgress size={24} />
    } else {
      return (
        <Button
          color="primary"
          onClick={this.submit}
          disabled={!this.canSubmit()}
          variant="contained"
          className={classes.button}
        >
          Create User
            </Button>
      );
    }
  }

  private canSubmit(): boolean {
    const { email } = this.state;
    return email.length > 3 && !!email.match(/.+@.+\..+/);
  }

  private submit = async () => {
    this.setState({ saving: true });
    const { email } = this.state;
    try {
      await BSGServices.getInstance().createUser({ email });
      this.props.enqueueSnackbar('Invitation email sent', { variant: 'success' });
      this.setState({ saving: false, email: '' });
    } catch (e) {
      console.error(e);
      this.props.enqueueSnackbar('Failed creating account', { variant: 'error' });
      this.setState({ saving: false });
    }
  }

  private onEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: ev.currentTarget.value });
  }
}

export default withSnackbar(withStyles(styles)(NewUser));
