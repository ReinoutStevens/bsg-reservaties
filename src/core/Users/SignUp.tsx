import React from 'react';
import { Paper, Typography, CircularProgress, TextField, WithStyles, Button, Theme } from '@material-ui/core';
import { withStyles, createStyles } from '@material-ui/styles';
import withFirebase, { WithFirebase } from '../Session/withFirebase';

export interface SignUpProps {

}

export interface SignUpState {
  error: string | null;
  saving: boolean;
  email: string;
}

const styles = (theme: Theme) => createStyles({
  button: {
    margin: theme.spacing(1),
  },
});

type SignUpProps_ = SignUpProps & WithStyles<typeof styles> & WithFirebase;

class SignUp extends React.Component<SignUpProps_, SignUpState> {
  constructor(props: SignUpProps_) {
    super(props);
    this.state = {
      error: null,
      saving: false,
      email: '',
    };
  }

  render() {
    const { email } = this.state;
    return (
      <>
        <Typography variant="h5">Completing Signup</Typography>
        <Paper>
          <TextField
            value={email}
            label="Confirm Email"
            onChange={this.onUpdateEmail}
            type="email"
            fullWidth
          />
          {this.renderButton()}
          {this.renderError()}
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
          Submit
        </Button>
      );
    }
  }

  private renderError() {
    const { error } = this.state;
    if (!error) {
      return;
    }
    return (
      <Typography color="error">
        {error}
      </Typography>
    )
  }

  private canSubmit(): boolean {
    const { email } = this.state;
    return email.length > 3 && !!email.match(/.+@.+\..+/);
  }

  private onUpdateEmail = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: ev.currentTarget.value });
  }

  private submit = async () => {
    const { firebase } = this.props;
    const { email } = this.state;
    this.setState({ saving: true, error: null });
    try {
      await firebase.completeSignIn({ email });
      this.setState({ saving: false });
    } catch (e) {
      this.setState({ error: e.message, saving: false });
    }

  }
}

export default withFirebase(withStyles(styles)(SignUp));
