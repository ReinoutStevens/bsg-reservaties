import React from 'react';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { TextField, Button, CircularProgress, createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/styles';
import withFirebase, { WithFirebase } from '../../core/Session/withFirebase';
import validEmail from '../../util/validEmail';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Form from '../../core/Form/Form';

interface NewUserProps {
}

interface NewUserState {
  saving: boolean;
  email: string;

}

const styles = (theme: Theme) => createStyles({
  button: {
    margin: theme.spacing(3, 0, 2),
  }
});

type NewUserProps_ = NewUserProps & WithSnackbarProps & WithStyles<typeof styles> & WithFirebase;

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
      <Form title="Create User" icon={<PersonAddIcon />}>
        <TextField
          variant="outlined"
          margin="normal"
          value={email}
          onChange={this.onEmailChange}
          type="email"
          label="Email"
          fullWidth
          required
        />
        {this.renderButton()}
      </Form>
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
          type="submit"
          fullWidth
        >
          Create User
        </Button>
      );
    }
  }

  private canSubmit(): boolean {
    const { email } = this.state;
    return validEmail(email);
  }

  private submit = async () => {
    this.setState({ saving: true });
    const { firebase } = this.props;
    const { email } = this.state;
    try {
      await firebase.createUser({ email });
      this.props.enqueueSnackbar('Invitation email sent');
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

export default withFirebase(withSnackbar(withStyles(styles)(NewUser)));
